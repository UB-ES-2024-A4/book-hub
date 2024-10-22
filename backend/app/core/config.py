import os

from pydantic import (
    MySQLDsn,
    computed_field
)
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
        Esta clase trata de encapsular las variables de entorno y la configuracion del backend
    """

    def get_env_file() -> str:
        """
            Check default locations for .env configuration file
            :return: configuration file
        """
        top_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), '.env')
        if os.path.exists('.env'):
            env_file = '.env'
        elif os.path.exists(top_path):
            env_file = top_path
        else:
            env_file = '.env'

        return env_file

    model_config = SettingsConfigDict(
        env_file=get_env_file(), env_ignore_empty=True, extra="ignore"
    )

    APP_NAME: str = "UnSet"
    DB_HOST: str = "localhost"
    DB_PORT: int = 3307
    DB_USER: str = "user"
    DB_PASSWORD: str | None = None
    DB_NAME: str | None = None

    @computed_field  # type: ignore[misc]
    @property
    def SQLALCHEMY_URI(self) -> MySQLDsn:

        database_uri = MultiHostUrl.build(
            scheme="mysql+pymysql",
            username=self.DB_USER,
            password=self.DB_PASSWORD,
            host=self.DB_HOST,
            port=self.DB_PORT,
            path=self.DB_NAME,
        )

        return database_uri
        

settings = Settings()