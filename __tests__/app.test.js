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

describe('/api/reviews/:review_id', () => {
  describe('get request ', () => {
    test('returns the review of the id given', () => {
      return request(app)
      .get('/api/reviews/1')
      .expect(200)
      .then(({body}) =>{
        expect(body.review).toEqual({
          category: "euro game",
          created_at: "2021-01-18T10:00:20.514Z",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_body: "Farmyard fun!",
          review_id: 1,
          review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          title: "Agricola",
          votes: 1,
          })
      })
    });

    test('should give error if id given is out of range', () => {
      return request(app)
      .get('/api/reviews/100')
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toEqual('ID does not exist')
      })
    });

    test('should give error if id given is out of range', () => {
      return request(app)
      .get('/api/reviews/hello')
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toEqual('Invalid parameter')
      })
    });
  });
});