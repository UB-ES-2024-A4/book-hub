export const dummyDatabase = {
    "users": [
      {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "username": "johndoe",
        "email": "john.doe@example.com",
        "biography": "Avid reader and photographer."
      },
      {
        "id": 2,
        "first_name": "Jane",
        "last_name": "Smith",
        "username": "janesmith",
        "email": "jane.smith@example.com",
        "biography": "Book lover and travel blogger."
      },
      {
        "email": "alejandro@test.com",
        "username": "Alejandro",
        "first_name": "Alejandro",
        "last_name": null,
        "id": 7,
        "biography": null
      },
      {
        "email": "mar@test.com",
        "username": "Maruja",
        "first_name": "Mar",
        "last_name": null,
        "id": 8,
        "biography": null
      },
      {
        "email": "william@test.com",
        "username": "William",
        "first_name": "William D",
        "last_name": null,
        "id": 3,
        "biography": null
      },
      {
        "email": "malik@test.com",
        "username": "Malik",
        "first_name": "Malik",
        "last_name": null,
        "id": 4,
        "biography": null
      },
      {
        "email": "victor@test.com",
        "username": "Victor",
        "first_name": "Victor",
        "last_name": null,
        "id": 5,
        "biography": null
      },
      {
        "email": "arnau@test.com",
        "username": "Arnau",
        "first_name": "Arnau",
        "last_name": null,
        "id": 6,
        "biography": null
      }
    ],
    "books": [
      {
        "id": 1,
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "description": "A novel set in the Roaring Twenties.",
        "created_at": "2023-01-01T10:00:00Z",
        "category": "Drama"
      },
      {
        "id": 6,
        "title": "Asesinato en el Orient Express",
        "author": "Agatha Christie",
        "description": "Un asesinato misterioso ocurre en un lujoso tren, y Hércules Poirot debe resolverlo.",
        "created_at": "2023-01-01T10:00:00Z"
      },
      {
        "id": 7,
        "title": "Cien años de soledad",
        "author": "Gabriel García Márquez",
        "description": "La historia mágica y trágica de la familia Buendía en Macondo.",
        "created_at": "2023-01-01T10:00:00Z"
      },
      {
        "id": 3,
        "title": "1984",
        "author": "George Orwell",
        "description": "Una distopía donde el Gran Hermano lo controla todo, y la libertad es solo un sueño.",
        "created_at": "2023-01-01T10:00:00Z"
      },
      {
        "id": 4,
        "title": "El principito",
        "author": "Antoine de Saint-Exupéry",
        "description": "Un cuento encantador sobre la amistad y el descubrimiento.",
        "created_at": "2023-01-01T10:00:00Z"
      },
      {
        "id": 5,
        "title": "El señor de los anillos",
        "author": "J.R.R. Tolkien",
        "description": "La épica aventura para destruir el Anillo Único y salvar la Tierra Media.",
        "created_at": "2023-01-01T10:00:00Z"
      },
      {
        "id": 8,
        "title": "Cien años de soledad",
        "author": "Gabriel García Márquez",
        "description": "La historia mágica y trágica de la familia Buendía en Macondo.",
        "created_at": "2023-01-01T10:00:00Z"
      },
    ],
    "posts": [
      {
        "id": 1,
        "book_id": 1,
        "user_id": 1,
        "likes": 45,
        "description": "Exploring the themes of wealth and morality in Gatsby.",
        "created_at": "2023-05-01T12:00:00Z",
        "filter_ids": [
          { "id": 1, "name": "Drama" },
          { "id": 2, "name": "Comedia" },
          { "id": 3, "name": "Romance" }
        ]
      },
      {
        "id": 2,
        "book_id": 6,
        "user_id": 2,
        "likes": 7,
        "description": "Hércules Poirot es el mejor detective. ¡Qué historia! El final me dejó boquiabierta.",
        "created_at": "2023-05-01T12:00:00Z",
        "filter_ids": [
          { "id": 1, "name": "Drama" }
        ]
      },
      {
        "id": 3,
        "book_id": 8,
        "user_id": 3,
        "likes": 10,
        "description": "La narrativa mágica de Macondo me hizo reflexionar sobre la vida y el tiempo.",
        "created_at": "2023-05-02T12:00:00Z",
        "filter_ids": [
          { "id": 1, "name": "Drama" }
        ]
      },
      {
        "id": 4,
        "book_id": 3,
        "user_id": 4,
        "likes": 8,
        "description": "1984 es un libro impactante. Me hizo cuestionar todo sobre el poder y la libertad.",
        "created_at": "2023-05-03T12:00:00Z",
        "filter_ids": [
          { "id": 1, "name": "Drama" },
          { "id": 5, "name": "Sci-Fi" }
        ]
      },
      {
        "id": 5,
        "book_id": 5,
        "user_id": 5,
        "likes": 12,
        "description": "Una aventura épica. Tolkien es el maestro de la fantasía.",
        "created_at": "2023-05-04T12:00:00Z",
        "filter_ids": [
          { "id": 4, "name": "Fantasy" }
        ]
      },
      {
        "id": 6,
        "book_id": 8,
        "user_id": 6,
        "likes": 9,
        "description": "El drama de la familia Buendía es increíble. Definitivamente un libro que cambia vidas.",
        "created_at": "2023-05-05T12:00:00Z",
        "filter_ids": [
          { "id": 1, "name": "Drama" }
        ]
      },
      {
        "id": 7,
        "book_id": 4,
        "user_id": 1,
        "likes": 14,
        "description": "Una aventura llena de lecciones de vida y humor. ¡El principito siempre será un clásico!",
        "created_at": "2023-05-06T12:00:00Z",
        "filter_ids": [
          { "id": 1, "name": "Drama" },
          { "id": 2, "name": "Comedia" },
          { "id": 3, "name": "Romance" }
        ]
      },
      {
        "id": 8,
        "book_id": 5,
        "user_id": 2,
        "likes": 15,
        "description": "Un mundo lleno de criaturas mágicas y aventuras épicas. No me canso de leerlo.",
        "created_at": "2023-05-07T12:00:00Z",
        "filter_ids": [
          { "id": 1, "name": "Drama" },
          { "id": 4, "name": "Fantasy" }
        ]
      },
      {
        "id": 9,
        "book_id": 3,
        "user_id": 3,
        "likes": 11,
        "description": "El futuro distópico de 1984 sigue siendo una advertencia para todos nosotros.",
        "created_at": "2023-05-08T12:00:00Z",
        "filter_ids": [
          { "id": 1, "name": "Drama" },
          { "id": 5, "name": "Sci-Fi" }
        ]
      }
    ],
    "categoryPosts": [
    {
      "category": "Drama",
      "posts": [
        {
          "id": 1,
          "book_id": 1,
          "user_id": 1,
          "likes": 45,
          "description": "Exploring the themes of wealth and morality in Gatsby.",
          "created_at": "2023-05-01T12:00:00Z",
          "filter_ids": [
            { "id": 1, "name": "Drama" },
            { "id": 2, "name": "Comedia" },
            { "id": 3, "name": "Romance" }
          ]
        },
        {
          "id": 3,
          "book_id": 8,
          "user_id": 3,
          "likes": 10,
          "description": "La narrativa mágica de Macondo me hizo reflexionar sobre la vida y el tiempo.",
          "created_at": "2023-05-02T12:00:00Z",
          "filter_ids": [
            { "id": 1, "name": "Drama" }
          ]
        },
        {
          "id": 6,
          "book_id": 8,
          "user_id": 6,
          "likes": 9,
          "description": "El drama de la familia Buendía es increíble. Definitivamente un libro que cambia vidas.",
          "created_at": "2023-05-05T12:00:00Z",
          "filter_ids": [
            { "id": 1, "name": "Drama" }
          ]
        },
        {
          "id": 2,
          "book_id": 6,
          "user_id": 2,
          "likes": 7,
          "description": "Hércules Poirot es el mejor detective. ¡Qué historia! El final me dejó boquiabierta.",
          "created_at": "2023-05-01T12:00:00Z",
          "filter_ids": [
            { "id": 1, "name": "Drama" }
          ]
        },
        {
          "id": 4,
          "book_id": 3,
          "user_id": 4,
          "likes": 8,
          "description": "1984 es un libro impactante. Me hizo cuestionar todo sobre el poder y la libertad.",
          "created_at": "2023-05-03T12:00:00Z",
          "filter_ids": [
            { "id": 1, "name": "Drama" },
            { "id": 5, "name": "Sci-Fi" }
          ]
        },
        {
          "id": 7,
          "book_id": 4,
          "user_id": 1,
          "likes": 14,
          "description": "Una aventura llena de lecciones de vida y humor. ¡El principito siempre será un clásico!",
          "created_at": "2023-05-06T12:00:00Z",
          "filter_ids": [
            { "id": 1, "name": "Drama" },
            { "id": 2, "name": "Comedia" },
            { "id": 3, "name": "Romance" }
          ]
        },
        {
          "id": 8,
          "book_id": 5,
          "user_id": 2,
          "likes": 15,
          "description": "Un mundo lleno de criaturas mágicas y aventuras épicas. No me canso de leerlo.",
          "created_at": "2023-05-07T12:00:00Z",
          "filter_ids": [
            { "id": 1, "name": "Drama" },
            { "id": 4, "name": "Fantasy" }
          ]
        },
        {
          "id": 9,
          "book_id": 3,
          "user_id": 3,
          "likes": 11,
          "description": "El futuro distópico de 1984 sigue siendo una advertencia para todos nosotros.",
          "created_at": "2023-05-08T12:00:00Z",
          "filter_ids": [
            { "id": 1, "name": "Drama" },
            { "id": 5, "name": "Sci-Fi" }
          ]
        }
      ]
    },
    {
      "category": "Comedia",
      "posts": [
        {
          "id": 7,
          "book_id": 4,
          "user_id": 1,
          "likes": 14,
          "description": "Una aventura llena de lecciones de vida y humor. ¡El principito siempre será un clásico!",
          "created_at": "2023-05-06T12:00:00Z",
          "filter_ids": [
            { "id": 2, "name": "Comedia" },
            { "id": 3, "name": "Romance" }
          ]
        }

      ]
    },
    {
      "category": "Romance",
      "posts": [
        {
          "id": 7,
          "book_id": 4,
          "user_id": 1,
          "likes": 14,
          "description": "Una aventura llena de lecciones de vida y humor. ¡El principito siempre será un clásico!",
          "created_at": "2023-05-06T12:00:00Z",
          "filter_ids": [
            { "id": 2, "name": "Comedia" },
            { "id": 3, "name": "Romance" }
          ]
        },
        {
          "id": 1,
          "book_id": 1,
          "user_id": 1,
          "likes": 45,
          "description": "Exploring the themes of wealth and morality in Gatsby.",
          "created_at": "2023-05-01T12:00:00Z",
          "filter_ids": [
            { "id": 1, "name": "Drama" },
            { "id": 2, "name": "Comedia" },
            { "id": 3, "name": "Romance" }
          ]
        }
      ]
    },
    {
      "category": "Fantasy",
      "posts": [
        {
          "id": 5,
          "book_id": 5,
          "user_id": 5,
          "likes": 12,
          "description": "Una aventura épica. Tolkien es el maestro de la fantasía.",
          "created_at": "2023-05-04T12:00:00Z",
          "filter_ids": [
            { "id": 4, "name": "Fantasy" }
          ]
        },
        {
          "id": 8,
          "book_id": 5,
          "user_id": 2,
          "likes": 15,
          "description": "Un mundo lleno de criaturas mágicas y aventuras épicas. No me canso de leerlo.",
          "created_at": "2023-05-07T12:00:00Z",
          "filter_ids": [
            { "id": 4, "name": "Fantasy" }
          ]
        }
      ]
    },
    {
      "category": "Sci-Fi",
      "posts": [
        {
          "id": 4,
          "book_id": 3,
          "user_id": 4,
          "likes": 8,
          "description": "1984 es un libro impactante. Me hizo cuestionar todo sobre el poder y la libertad.",
          "created_at": "2023-05-03T12:00:00Z",
          "filter_ids": [
            { "id": 5, "name": "Sci-Fi" }
          ]
        },
        {
          "id": 9,
          "book_id": 3,
          "user_id": 3,
          "likes": 11,
          "description": "El futuro distópico de 1984 sigue siendo una advertencia para todos nosotros.",
          "created_at": "2023-05-08T12:00:00Z",
          "filter_ids": [
            { "id": 5, "name": "Sci-Fi" }
          ]
        }
      ]
    }
  ]
};
  