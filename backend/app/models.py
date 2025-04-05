from pydantic import BaseModel

class UserModel(BaseModel):
    username: str
    emailgoogle: str
    address_wallet: str

    class Config:
        schema_extra = {
            "example": {
                "username": "johndoe",
                "emailgoogle": "johndoe@gmail.com",
                "address_wallet": "0x123456789abcdef"
            }
        }
