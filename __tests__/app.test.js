const request = require("supertest");
const app = require("../app.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/ap/categories", () => {
  describe("get request", () => {
    test("shoul return all categories with the with the following column properties: slug and description", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
            expect(body.categories).toBeInstanceOf(Array)
            expect(body.categories).toHaveLength(4)
            
            body.categories.forEach((category)=>{
              expect(category).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String)
              });
            }) 
        });
    });

    test('when the url is not a correct route, return appropriate message with 404 status code', () => {
        return request(app)
        .get('/api/cate')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('Route not found')
        })
    });
  });
});
