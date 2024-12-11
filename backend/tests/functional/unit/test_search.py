import pytest
from sqlmodel import Session, SQLModel, create_engine
from app.models import User
from app.crud.search import search_users_in_db

# In-memory SQLite database for testing
database_url = "sqlite://"
engine = create_engine(database_url, echo=True)

@pytest.fixture
def setup_database():
    """Fixture to set up the database with test data."""
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        # Adding test users
        session.add_all([
            User(email="alice@test.com", username="alice", first_name="Alice", password="password"),
            User(email="bob@test.com", username="bob", first_name="Bob", password="password"),
            User(email="charlie@test.com", username="charlie", first_name="Charlie", password="password"),
            User(email="dave@test.com", username="dave", first_name="David", password="password"),
            User(email="eve@test.com", username="eve", first_name="Evelyn", password="password"),
            User(email="alison@test.com", username="alison", first_name="Alison", password="password"),
        ])
        session.commit()
    yield
    SQLModel.metadata.drop_all(engine)


@pytest.fixture
def session():
    """Fixture to provide a database session."""
    with Session(engine) as session:
        yield session


def test_search_exact_match(setup_database, session):
    """Test exact match for username."""
    result = search_users_in_db("alice", session)
    assert len(result) == 1
    assert result[0].username == "alice"


def test_search_partial_match(setup_database, session):
    """Test partial match for username and first name."""
    result = search_users_in_db("ali", session)
    assert len(result) == 2
    usernames = [user.username for user in result]
    assert "alice" in usernames
    assert "alison" in usernames


def test_search_case_insensitivity(setup_database, session):
    """Test case-insensitivity in search."""
    result = search_users_in_db("ALICE", session)
    assert len(result) == 1
    assert result[0].username == "alice"


def test_search_no_match(setup_database, session):
    """Test no matches found."""
    result = search_users_in_db("nonexistent", session)
    assert len(result) == 0


def test_search_ordering(setup_database, session):
    """Test alphabetical ordering of results."""
    result = search_users_in_db("a", session)
    assert len(result) == 4
    assert result[0].username == "alice"
    assert result[1].username == "alison"
    assert result[2].username == "charlie"
    assert result[3].username == "dave"
    

def test_search_similar_names(setup_database, session):
    """Test searching for users with similar names."""
    result = search_users_in_db("eve", session)
    assert len(result) == 1
    assert result[0].username == "eve"