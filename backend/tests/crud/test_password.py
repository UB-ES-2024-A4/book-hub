from app.core.security import get_password_hash, verify_password


PASSWORD = 'password'

def test_get_password_hash() -> None:
    assert get_password_hash(PASSWORD)

def test_verify_password() -> None:
    password_hash = get_password_hash(PASSWORD)
    assert verify_password(password_hash, PASSWORD)
    assert not verify_password(password_hash, 'wrong_password')

def test_2_password_hash_different() -> None:
    password_hash = get_password_hash(PASSWORD)
    password_hash2 = get_password_hash(PASSWORD)
    assert password_hash != password_hash2
