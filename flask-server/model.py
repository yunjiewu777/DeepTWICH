import torch
import torch.nn as nn
from torchvision import transforms


# Creating a PyTorch class
# 50 ==> 10 ==> 50
class AE(torch.nn.Module):
    def __init__(self):
        super().__init__()

        # Building an linear encoder with Linear
        # layer followed by Relu activation function
        # 50 ==> 10
        self.encoder = torch.nn.Sequential(
            torch.nn.Linear(50, 25),
            torch.nn.ReLU(),
            torch.nn.Linear(25, 10),
            torch.nn.ReLU(),
            torch.nn.Linear(10, 2)
        )

        # Building an linear decoder with Linear
        # layer followed by Relu activation function
        # The Sigmoid activation function
        # outputs the value between 0 and 1
        # 10 ==> 50
        self.decoder = torch.nn.Sequential(
            torch.nn.Linear(2, 10),
            torch.nn.ReLU(),
            torch.nn.Linear(10, 25),
            torch.nn.ReLU(),
            torch.nn.Linear(25, 50),
            torch.nn.Sigmoid()
        )

    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return encoded, decoded

input_dim = 50
