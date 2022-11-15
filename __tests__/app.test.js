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

          expect(body.reviews).toBeSortedBy('created_at', {descending: true})

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


describe('/api/reviews/:review_id', () => {
  describe('get request ', () => {
    test('returns the review of the id given', () => {
      return request(app)
      .get('/api/reviews/1')
      .expect(200)
      .then(({body}) =>{
        expect(body.review).toMatchObject({
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

describe('/api/reviews/:review_id/comments', () => {
  describe('get request', () => {
    test('get all comments of the review with the given id', () => {
      return request(app)
      .get('/api/reviews/3/comments')
      .expect(200)
      .then(({body})=>{
        expect(body.comments).toBeInstanceOf(Array)
        expect(body.comments).toHaveLength(3)

        body.comments.forEach((comment)=>{
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 3
          })
        })
      })
    });

    test('should give error if id given is out of range', () => {
      return request(app)
      .get('/api/reviews/100/comments')
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toEqual('ID does not exist')
      })
    });

    test('should give error if id given is out of range', () => {
      return request(app)
      .get('/api/reviews/hello/comments')
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toEqual('Invalid parameter')
      })
    });

    test('should give error if id given is out of range', () => {
      return request(app)
      .get('/api/reviews/1/comments')
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toEqual('No comments in this review')
      })
    });
  });

  describe('post request', () => {
    test("posts the new treasure with a status code of 201", () => {
      const newComment = {
          votes: 10,
          created_at: new Date(1523569852365),
          author: 'bainesface',
          body: 'EPIC board game!',
      };

      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 7,
            review_id: 1,
            votes: 10,
            created_at: "2018-04-12T20:50:52.365Z",
            author: 'bainesface',
            body: 'EPIC board game!'});
        });
    });

  });
});
