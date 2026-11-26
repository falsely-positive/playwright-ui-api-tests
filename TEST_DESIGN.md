# Test Design


## 1. What I chose to test

- **UI: OrangeHRM login.** It's the entry point to the whole application, it has positive, negative and validation behaviour on one page, and it needs no test data.

### Rationale for UI tests

- **Positive cases first:** if valid users can't log in, the application can't be used at all.
- **Error messages next:** people without valid credentials must not get in. It's also important that invalid credentials don't reveal anything, so a standard error is shown rather than confirming whether the username exists or which field was wrong.
- **Validation last:** "Required" messages tell users why their login attempt didn't work, so they can fix it themselves. This isn't more important than security testing, but it's quick to implement alongside the other login tests, and it can only be tested through the UI because OrangeHRM checks empty fields in the browser. It's also a foundation for the accessibility tests: a screen reader can only announce a message that exists.

### Rationale for API tests

- **Positive cases first:** creating a pet is what this endpoint is for. If valid pets can't be created, nothing that depends on pet data works.
- **Error handling next:** requests the server can't read (no body, malformed JSON, an unsupported content type) must be rejected without creating anything, with a status code the client can act on.
- **Validation last:** requests that can be read but contain invalid fields (a missing name, a text ID) must be rejected before the data is stored. Invalid data that gets in causes problems for everything that reads it later.


- **API: Petstore `POST /pet`.** Creating data has the most ways to fail: required fields, types and content types. I read "one endpoint" as one method on one path. `GET` and `DELETE` are only used to check that a pet was stored and to clean up.

## 2. UI tests: OrangeHRM login

### Positive / happy path

A user's main goal is to get in, and the password must never be visible.

- A user with valid credentials is signed in to the dashboard
- The password is masked as it is typed

### Negative / error

Failed logins must give a clear message and not leave credentials in the form.

- Wrong username shows "Invalid credentials" and stays on the login page
- Wrong password shows "Invalid credentials" and stays on the login page
- The username and password fields are cleared after a failed login

### Validation

OrangeHRM checks empty fields in the browser before sending anything, so these messages can only be tested through the UI.

- Missing password shows "Required" under the password field
- Missing username shows "Required" under the username field
- Missing username and password shows "Required" under both fields
- Each "Required" message clears only when its own field is filled in
- The "Invalid credentials" alert clears when the next attempt fails field validation (known defect)

### Further tests, in priority order

#### Security

First, because session handling is the highest-risk part of login.

- After logout, pressing back doesn't show the dashboard
- After logout, the old session cookie is rejected by the server
- Going straight to the dashboard URL when not logged in redirects to the login page

#### Accessibility

A known defect already exists here, and users who can't use the form can't use the application at all.

- label linked to each text field
- text fields can be tabbed/swiped between on a screen reader
- alt text for images on screen

---

## 3. API tests: Petstore `POST /pet`

### Positive / happy path

The smallest valid pet and a fully specified one, so both the required fields and every optional field are checked.

- Add valid pet with minimum spec with json body
- A fully specified pet is created with every field stored json body

### Negative / error

Requests that can't be read at all should be rejected without creating anything.

- A request with no body is rejected with 405 "no data"
- Malformed JSON is rejected with 400 "bad input" and no pet is created
- A body sent as text/plain is rejected with 415 and no pet is created
- A body sent as application/octet-stream is rejected with 415 and no pet is created

### Validation

Readable requests with invalid fields should be rejected with a clear message. Both of these are defects.

- A non-numeric id fails with 500 "something bad happened" (defect)
- A pet with no name is accepted with 200 (defect)

### Further functional tests, in priority order

Ordered by risk: the impact if it breaks, how likely it is to be broken, and the cost to automate. XML is first because it's a documented format with no test coverage, and a break would stop XML clients completely.

- create a pet with xml body
- check response with xml body
- test validation on photo url structure
- boundary conditions with max value of id, name, photourl
- test valid status types accepted
- test invalid status types rejected
- test for special characters in text fields
- max number of tags and photourls

### Non-functional tests, in priority order

#### Security

- error responses don't expose internal details (stack traces, exception names, server versions)
- authentication and authorisation are enforced on the operations the spec says are protected
- injection-style input in text fields (SQL, script tags) is stored safely and returned escaped

#### Performance

Built up in steps, from normal traffic to breaking point. These would run against a dedicated environment, not the shared public demo.

- load test of endpoints with regular traffic
- test of endpoints with max expected traffic
- Stress test of endpoint
