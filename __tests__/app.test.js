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
            expect(body.categories).toEqual([
                { slug: 'euro game', description: 'Abstact games that involve little luck' },
                {
                  slug: 'social deduction',
                  description: "Players attempt to uncover each other's hidden role"
                },
                { slug: 'dexterity', description: 'Games involving physical skill' },
                { slug: "children's games", description: 'Games suitable for children' }
              ])
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
