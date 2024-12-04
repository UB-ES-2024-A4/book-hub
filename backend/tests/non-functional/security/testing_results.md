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


Here's the updated section of your testing document with the mention of the .csv file attachment:

---

## **Test Case 3: Using OWASP ZAP for Security Testing**
**Purpose:** Use OWASP ZAP to scan for common vulnerabilities and simulate attacks on the `/users/` and `/posts/` APIs.

#### **Steps:**
1. **Set Up ZAP:**
   - Configure ZAP as a proxy between your browser/API client and the backend to monitor and manipulate requests.

2. **Crawl the Application:**
   - Use the ZAP spider to crawl the application and discover all accessible endpoints (`/users/` and `/posts/`).

3. **Perform Active Scanning:**
   - After discovering endpoints, run an **Active Scan** on `/users/` and `/posts/` to test for vulnerabilities such as XSS, SQL Injection, and other common web flaws.

4. **Analyze Results:**
   - Review the report generated by ZAP. The following findings were identified:

   **Alerts:**
   - **X-Content-Type-Options Header Missing**
     - **Description:** The Anti-MIME-Sniffing header `X-Content-Type-Options` was not set to `nosniff`. This potentially allows older versions of Internet Explorer and Chrome to perform MIME-sniffing on the response body, which can cause the response body to be interpreted incorrectly and displayed as a different content type.
     - **Solution:** Ensure that the application/web server sets the `X-Content-Type-Options` header to `nosniff` for all web pages and appropriately sets the `Content-Type` header. Additionally, encourage users to utilize standards-compliant and modern web browsers that do not perform MIME-sniffing.
     - **Severity:** Low (does not cause functional issues but can lead to security vulnerabilities in outdated browsers).

5. **Expected Result:**
   - ZAP did not detect any critical vulnerabilities (e.g., SQL Injection, XSS).
   - Only an informational alert for missing the `X-Content-Type-Options` header was generated, which is a low-severity issue.

---

## **Conclusion**
1. **ZAP Scan Results:** The active scan did not identify any critical vulnerabilities, such as SQL Injection or XSS, in the `/users/` and `/posts/` APIs.
2. **Alert Summary:**
   - The only alert generated was for the missing `X-Content-Type-Options` header. This is a minor security recommendation that ensures better MIME type handling and prevents certain types of attacks on legacy browsers.
3. **Recommendations:**
   - Add the `X-Content-Type-Options` header with the value `nosniff` to all web pages to prevent MIME-sniffing on older browsers and improve overall security.

**Test Results File:** The full scan results are available in the attached `.csv` file.