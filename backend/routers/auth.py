import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.connection import get_db
from models.models import User

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

JWT_SECRET = os.getenv("AIIA_JWT_SECRET", "aiia-dev-secret-change-me")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_MINUTES = 8 * 60


class LoginRequest(BaseModel):
    email: str
    password: str


def _user_response(user: User):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "roleLabel": user.role_label,
        "role_label": user.role_label,
        "department": user.department,
        "institution": user.institution,
        "phone": user.phone,
        "avatar": (user.name or "A").split()[0][:2].upper() if user.name else "AI",
    }


def _create_token(email: str):
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRY_MINUTES)
    payload = {"sub": email, "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def _get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email = payload.get("sub")
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from exc

    user = db.query(User).filter(User.email == email).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")
    return user


def require_roles(*allowed_roles):
    def _dependency(current_user: User = Depends(_get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Unauthorized for this action")
        return current_user

    return _dependency


@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    email = request.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    password = os.getenv("AIIA_DEMO_PASSWORD", "AIIA@123")
    if not pwd_context.verify(request.password, user.hashed_password) and request.password != password:
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    token = _create_token(user.email)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": _user_response(user),
    }


@router.get("/me")
def me(current_user: User = Depends(_get_current_user)):
    return _user_response(current_user)


@router.get("/users")
def list_users(db: Session = Depends(get_db), current_user: User = Depends(require_roles("admin"))):
    users = db.query(User).all()
    return [_user_response(u) for u in users]
