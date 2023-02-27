import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

X = np.load("xes.npy")
y = np.load("ys.npy")
idx = np.arange(len(X))
np.random.shuffle(idx)
X = X[idx]
y = y[idx]

X_train = X[(len(X) // 5):]
y_train = y[(len(X) // 5):]
X_test = X[:(len(X) // 5)]
y_test = y[:(len(X) // 5)]

model = tf.keras.models.Sequential([
    tf.keras.layers.Input((63)),
    tf.keras.layers.Dense(48, activation='relu'),
    tf.keras.layers.Dense(27, activation='softmax')
])

model.compile(
    optimizer="adam", loss=keras.losses.CategoricalCrossentropy(), metrics=["accuracy"]
)

model.fit(X_train, y_train, epochs=9, validation_data=(X_test, y_test))
model.save("model.h5")
