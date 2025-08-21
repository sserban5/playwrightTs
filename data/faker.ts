import { faker } from '@faker-js/faker';

export function generatePeople() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const userData = {
    firstName,
    lastName,
    phoneNr: faker.phone.number(),
    email: faker.internet.email({ firstName, lastName }),
  };
  return userData;
}


export function generatePetPayload() {
  return {
    id: faker.number.int({ min: 1, max: 10000 }),
    name: faker.animal.petName(),
    category: {
      id: 1,
      name: faker.animal.type(),
    },
    photoUrls: [
      "string"
    ],
    tags: [
      {
        id: 0,
        name: faker.word.adjective(),
      }
    ],
    status: 'available',
  };
}
