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

describe("/api/categories", () => {
  describe("get request", () => {
    test("shoul return all categories with the with the following column properties: slug and description", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(body.categories).toBeInstanceOf(Array);
          expect(body.categories).toHaveLength(4);

          body.categories.forEach((category) => {
            expect(category).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });

    test("when the url is not a correct route, return appropriate message with 404 status code", () => {
      return request(app)
        .get("/api/cate")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Route not found");
        });
    });
  });
});

describe("/api/reviews", () => {
  describe("get request", () => {
    test("should return all reviews as an array with the correct columns and ordered", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toBeInstanceOf(Array);
          expect(body.reviews).toHaveLength(13);

          body.reviews.forEach((review) => {
            expect(review).toMatchObject({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(String)
            });
          });

          expect(body.reviews[0]).toEqual({
            owner: 'mallionaire',
            title: "Settlers of Catan: Don't Settle For Less",
            review_id: 13,
            category: 'social deduction',
            review_img_url: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
            created_at: '1970-01-10T02:08:38.400Z',
            votes: 16,
            designer: 'Klaus Teuber',
            comment_count: '0'
          })

          expect(body.reviews[body.reviews.length-1]).toEqual({
            owner: 'mallionaire',
            title: 'Mollit elit qui incididunt veniam occaecat cupidatat',
            review_id: 7,
            category: 'social deduction',
            review_img_url: 'https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            created_at: '2021-01-25T11:16:54.963Z',
            votes: 9,
            designer: 'Avery Wunzboogerz',
            comment_count: '0'
          })
        });
    });

    test("if given an incorrect endpoint, give 404 and route not found message", () => {
      return request(app)
        .get("/api/review")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Route not found");
        });
    });
  });
});
