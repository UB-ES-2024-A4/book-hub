# Backend Security Testing Plan

## **Objective**
Ensure the backend of the application is secure, free from vulnerabilities, and compliant with best practices for protecting sensitive data and resources.


## **Scope**
- Test all API endpoints exposed by the backend.
- Focus on vulnerabilities like Token Tampering, Broken Object-Level Authorization (BOLA), SQL Injection, Sensitive Data Exposure, and more.


## **Test Environment**
1. **Environment:** Localhost or staging environment.
2. **Tools:**
   - Postman for manual API testing.
   - OWASP ZAP for vulnerability scanning.
   - curl for inspecting headers and responses.
   - SQLMap for SQL Injection testing.
3. **Prerequisites:**
   - Active backend running on `http://127.0.0.1:8000/`.
   - Valid user credentials for authentication testing.


## **Security Goals**
1. Verify the integrity and confidentiality of sensitive data.
2. Ensure authentication and authorization mechanisms work as intended.
3. Validate input sanitization to prevent SQL Injection and XSS attacks.
4. Test secure error handling without exposing sensitive information.


## **Test Cases**

### **Test Case 1: Token Tampering**
**Purpose:** Validate that the backend rejects tampered or invalid tokens.

#### **Steps:**
1. **Obtain a Valid Token:**
   - Use the login API to authenticate as a user and retrieve a JWT token.

2. **Tamper with the Token:**
   - Decode the JWT (e.g., using jwt.io).
   - Modify the payload (e.g., change `user_id` or add unauthorized roles).
   - Re-encode the token.

3. **Send a Request with the Tampered Token:**
   - Use Postman or curl to send a request to a protected endpoint (e.g., `/users/me`).

   Example with curl:
   ```bash
   curl -X GET 'http://127.0.0.1:8000/users/me' \
   -H 'Authorization: Bearer <tampered_token>'
   -H 'accept: application/json'
   ```

4. **Expected Result:**
   - The server should return a `401 Unauthorized` or `403 Forbidden` response.
   - The response body should not disclose sensitive details (e.g., "invalid token" is acceptable).

---

### **Test Case 2: SQL Injection**
**Purpose:** Verify the backend's resistance to SQL Injection attacks.

#### **Steps:**
1. **Identify a Vulnerable Endpoint:**
   - Choose an endpoint that accepts query parameters or form data (e.g., `/users?search=`).

2. **Inject Malicious SQL:**
   - Test the endpoint with payloads like:
     ```
     ' OR '1'='1' --
     ``
     or
     ```
     '; DROP TABLE users; --
     ```

   Example with curl:
   ```bash
   curl -X GET 'http://127.0.0.1:8000/users?search='\'' OR \'1\'=\'1\' --' \
   -H 'accept: application/json'
   ```

3. **Analyze the Response:**
   - Ensure the server does not execute the malicious query.
   - The server should return a sanitized response or an error indicating invalid input.

4. **Expected Result:**
   - The backend must not execute any injected SQL commands.
   - The server should return a `400 Bad Request` or appropriate error without revealing database details.

---

## **Conclusions**
1. Documented results of the test cases.
2. Identified vulnerabilities and recommendations for fixing them.

