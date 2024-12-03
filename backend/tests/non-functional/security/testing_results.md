### **Test Case 1: Token Tampering**
**Purpose:** Validate that the backend properly identifies and rejects tampered or invalid JWT tokens.

#### **Steps:**
1. Generated a valid token using the login API:
   - **Request:**
     ```bash
     curl -X 'POST' \
     'http://127.0.0.1:8000/users/login/access-token' \
     -H 'accept: application/json' \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -d 'grant_type=password&username=Malik%40test.com&password=contrase%C3%B1a&scope=&client_id=string&client_secret=string'
     ```
   - **Response:**
     ```json
     {
       "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzM0MzI0NzUuMjU3MDMxLCJzdWIiOiI0In0.hrG3tqOGSB09GnWHLUSx0Tb68697B_xk44ZLeb-pDl8",
       "token_type": "bearer",
       "user": {
         "email": "malik@test.com",
         "username": "Malik",
         "first_name": "Malik",
         "last_name": null,
         "biography": null,
         "id": 4
       }
     }
     ```

2. Decoded the token using [jwt.io](https://jwt.io) and tampered with the `sub` field to change the `user_id` from `4` to `2`.

3. Used the tampered token to make a request to the `/users/me` endpoint:
   - **Request:**
     ```bash
     curl -X GET 'http://127.0.0.1:8000/users/me' \
     -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzM0MzI0NzUuMjU3MDMxLCJzdWIiOiIyIn0.qRv6xOYJ82jmtsvXvlv0sMiWZrQDBOlJtLsAtVUs1YM~' \
     -H 'accept: application/json'
     ```

   - **Response:**
     ```json
     {
       "detail": "Could not validate credentials"
     }
     ```

4. The backend returned a `403 Forbidden` response, indicating that the tampered token was rejected.


### **Result**
- **Status:** ✅ Passed
- **Expected Outcome:**
  - The backend should detect and reject tampered tokens.
  - The response should return a `403 Forbidden` or `401 Unauthorized` status with a generic error message.
- **Actual Outcome:**
  - The backend successfully identified the tampered token and returned an appropriate error (`403 Forbidden`) without exposing sensitive information.

#### **Observations:**
- The backend is secure against basic token tampering.
- The error message (`"Could not validate credentials"`) does not expose any implementation details, which aligns with security best practices.


---

### **Test Case 2: SQL Injection Results Documentation**

#### **Test Purpose:**
Verify that the backend is resistant to SQL Injection attacks for the `/books/title/{title}` endpoint.

#### **Steps Performed:**
1. **Identified Vulnerable Endpoint:**
   The endpoint used for testing was `/books/title/{title}`, where `title` is passed as a path parameter.

2. **Injected Malicious SQL:**
   Two SQL injection payloads were tested:

   - Payload 1:
     ```bash
     ' OR '1'='1' --
     ```

   - Payload 2:
     ```bash
     '; DROP TABLE books; --
     ```

   The following `curl` commands were executed:

   - **Payload 1:**
     ```bash
     curl -X 'GET' \
       'http://127.0.0.1:8000/books/title/%27%20OR%20%271%27=%271%27%20--' \
       -H 'accept: application/json'
     ```

   - **Payload 2:**
     ```bash
     curl -X 'GET' \
       'http://127.0.0.1:8000/books/title/%27%3B%20DROP%20TABLE%20books%3B%20--' \
       -H 'accept: application/json'
     ```

3. **Response Analysis:**
   Both SQL injection attempts returned the following error:
   ```json
   {"detail":"No books were found"}
   ```
   and an HTTP status code of **404 Not Found**.

#### **Conclusion:**
- **Expected Result**: The server should reject the malicious SQL input and return a sanitized response or an appropriate error, without exposing sensitive database details.
- **Actual Result**: The server returned a `404 Not Found` status with the message `"No books were found"`. This indicates that the endpoint handled the invalid input appropriately, without executing any malicious SQL commands.
  
  - The 404 error is not directly related to SQL injection handling but suggests that the server correctly filtered out invalid input and did not allow the SQL commands to be executed.

#### **Security Implications:**
- **Pass**: The backend appears to be safe from SQL injection, as the server does not execute the malicious input and returns a generic error message (`No books were found`) without revealing database details.

