import { test, expect, request } from "@playwright/test"
import petPayload from '../payloads/pet.json';
import { generatePetPayload } from '../data/faker';

test.describe('Api checks', () => {

    test.skip('api login', async ({ request }) => {
        const loginResponse = await request.get('https://api.training.testifi.io/api/v3/user/login?username=demo.user&password=Test!123');
        expect(loginResponse.status()).toBe(200);
        console.log('API login Response:', loginResponse);
    })

    test.skip('api add 1 pet', async ({ request }) => {
        const addPet = await request.post('https://api.training.testifi.io/api/v3/pet', { data: petPayload });

        expect(addPet.status()).toBe(201);
        const addPetResponseBody = await addPet.json()
        console.log("Add new pet response body:", addPetResponseBody)
    });

    test.skip('api add multiple pets with lists', async ({ request }) => {

        const petList = ["Bella", "Max", "Luna", "Charlie", "Lucy", "Cooper", "Daisy", "Milo", "Bailey", "Buddy"]
        const typeList = ["Dog", "Cat", "Fish", "Parrot", "Rabbit", "Hamster", "Snake", "Guinea pig", "Ferret", "Turtle"]
        const tagsList = ["happy", "loyal", "hungry", "sleepy", "playful", "loud", "curious", "huge", "trouble", "fast"]
        for (let index = 2; index < 11; index++) {
            const updatePet = {
                ...petPayload, id: index, name: petList[index],
                category: { ...petPayload.category, name: typeList[index] },
                tags: [{ ...petPayload.tags[0], name: tagsList[index] }]

            };
            const addPet = await request.post('https://api.training.testifi.io/api/v3/pet', { data: updatePet });
            expect(addPet.status()).toBe(201);
            const addPetResponseBody = await addPet.json()
            console.log("Add new pet response body:", addPetResponseBody)
        }

    });

    test('Add fake pets', async ({ request }) => {
        for (let i = 0; i < 10; i++) {
            const randomPet = generatePetPayload();
            const addRandomPet = await request.post('https://api.training.testifi.io/api/v3/pet', { data: randomPet });
            expect(addRandomPet.status()).toBe(201);
            const addPetResponseBody = await addRandomPet.json()
            console.log("Add new pet response body:", addPetResponseBody)
        }
    });

    test.skip('api delete pet', async ({ request }) => {
        const petId = petPayload.id;

        const deletePet = await request.delete('https://api.training.testifi.io/api/v3/pet/' + petId);
        expect(deletePet.status()).toBe(204);
    });

    test('add a pet with id=max+1', async ({ request }) => {
        const getAllAvailablePets = await request.get('https://api.training.testifi.io/api/v3/pet/findByStatus?status=available', { headers: { Accept: "application/json" } });

        expect(getAllAvailablePets.status()).toBe(200);
        const json = await getAllAvailablePets.json();
        const maxId = Math.max(...json.map((pet: { id: number }) => pet.id)) + 1;

        const updatePet = {
            ...petPayload, id: maxId
        };
        const addPet = await request.post('https://api.training.testifi.io/api/v3/pet', { data: updatePet });


    });

    test.skip('find all available pets and delete all with id higher than...', async ({ request }) => {
        const getAllAvailablePets = await request.get('https://api.training.testifi.io/api/v3/pet/findByStatus?status=available', { headers: { Accept: "application/json" } });

        expect(getAllAvailablePets.status()).toBe(200);
        const items: { id: number; name: string; category: { id: number; name: string }; photoUrls: string[]; tags: { id: number; name: string }[]; status: string }[] = await getAllAvailablePets.json();
        for (const pet of items) {
            if (pet.id > 11111111) {
                const deletePetById = await request.delete('https://api.training.testifi.io/api/v3/pet/' + pet.id);
                expect(deletePetById.status()).toBe(204);
            }
        }

    });

});