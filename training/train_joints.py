from tqdm import tqdm
import tensorflow as tf
import numpy as np
from tensorflow.keras import mixed_precision

mixed_precision.set_global_policy("mixed_float16")

ds = tf.keras.utils.image_dataset_from_directory(
    "asl_alphabet_train/", image_size=(224, 224), batch_size=1
).map(lambda x, y: (x / 255, tf.one_hot(y, 27)))

ds2 = tf.keras.utils.image_dataset_from_directory(
    "asl_alphabet_train/", image_size=(224, 224), batch_size=1
    ).map(lambda x, y: (x[:,::-1,...] / 255, tf.one_hot(y, 27)))

xes = np.zeros((len(ds)*2, 63))
ys = np.zeros((len(ds)*2, 27))

interpreter = tf.lite.Interpreter("hand_landmark_full.tflite")
interpreter.allocate_tensors()

# Get input and output tensors.
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Test the model on random input data.
input_shape = input_details[0]["shape"]

for i, (x, y) in enumerate(tqdm(ds)):
    interpreter.set_tensor(input_details[0]["index"], x)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]["index"])
    xes[i] = output_data
    ys[i] = y

for i, (x, y) in enumerate(tqdm(ds)):
    interpreter.set_tensor(input_details[0]["index"], x)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]["index"])
    xes[len(ds)+i] = output_data
    ys[len(ds)+i] = y

np.save("xes.npy", xes)
np.save("ys.npy", ys)
