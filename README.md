# Find a Friend

## Functional Requirements

- [X] should be able to sign up a ORG
- [X] should be able to sign in with a ORG
- [X] should be able to register a pet
- [X] should be able to search nearby pets (by cities)
- [X] should be able to filter pets by its characteristics (age, size, etc.)
- [X] should be able to get the total number of filtered pets
- [X] should be able to get a pet details
- [X] should be able to get a pet images metadatas
- [X] should be able to get a pet images data
- [X] should be able to delet a pet

## Business Rules

- [X] should not be able to search nearby pets without a city
- [X] should not be able to sign up a ORG without a whatsapp phone and address
- [X] should not be able to register a pet without a ORG
- [X] all filter are optionals, except the city filter
- [] should not be able to have a admin access withou login

## Non-functional Requirements

- [X] the org's password must be encrypted
- [X] the aplication's data must be stored in a PostgreSQL database
- [X] every data list must be paginated with 20 items per page
- [X] the org must be identified by a JWT (JSON Web Token)
- [X] the password must contain uppercase and lowercase letters, a special character, and more than six characters.
- [X] the pet's images can not be bigger than 10 Mb
- [X] the pet's images must be PNG or JPEG