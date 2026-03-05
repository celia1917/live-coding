import os  # <--- ESTA ES LA LÍNEA QUE FALTA
import time
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Función para intentar conectar con reintentos
def get_engine():
    # Ahora 'os' funcionará correctamente
    url = os.getenv("DATABASE_URL", "postgresql://admin:neon_pass@db/core_db")
    while True:
        try:
            engine = create_engine(url)
            engine.connect()
            print("--- CONEXIÓN EXITOSA CON POSTGRES ---")
            return engine
        except OperationalError:
            print("Esperando a la base de datos... (reintentando en 2s)")
            time.sleep(2)

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()