import os
from dotenv import load_dotenv
import sys

class Settings:
    """
        Esta clase trata de encapsular las variables de entorno y la configuracion del backend
    """

    def __init__(self):
        load_dotenv()
        
        self.APP_NAME = str(os.getenv("APP_NAME"))
        if self.APP_NAME is None: 
            self.APP_NAME = "Title unset"
    
        self.DATABASE_URL = str(os.getenv("DATABASE_URL"))
        if self.DATABASE_URL is None:
            sys.exit("DATABASE_URL not found in .env file. Check .env file.")    

        

settings = Settings()