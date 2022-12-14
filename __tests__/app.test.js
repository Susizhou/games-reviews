const request = require("supertest");
const app = require("../app.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const endPoints = require("../endpoints.json");

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
          expect(body.reviews).toHaveLength(10);

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
              comment_count: expect.any(Number),
            });
          });

          expect(body.total_count).toBe(13);
          expect(body.reviews).toBeSortedBy("created_at", { descending: true });
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

    describe("queries", () => {
      test("accepts category query", () => {
        return request(app)
          .get("/api/reviews?category=dexterity")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeInstanceOf(Array);
            expect(body.reviews).toHaveLength(1);

            body.reviews.forEach((review) => {
              expect(review).toMatchObject({
                category: "dexterity",
                comment_count: expect.any(Number),
                created_at: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_id: expect.any(Number),
                review_img_url: expect.any(String),
                title: expect.any(String),
                votes: expect.any(Number),
              });
            });

            expect(body.total_count).toBe(1);

            expect(body.reviews).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });

      test("category exists but no comments in the category, return 200 with empty array", () => {
        return request(app)
          .get("/api/reviews?category=children's games")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeInstanceOf(Array);
            expect(body.reviews).toHaveLength(0);
          });
      });

      test("accepts sort_by query", () => {
        return request(app)
          .get("/api/reviews?sort_by=votes")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeInstanceOf(Array);
            expect(body.reviews).toHaveLength(10);
            expect(body.reviews).toBeSortedBy("votes", { descending: true });

            expect(body.total_count).toBe(13);
          });
      });

      test("accepts order query", () => {
        return request(app)
          .get("/api/reviews?order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeInstanceOf(Array);
            expect(body.reviews).toHaveLength(10);

            expect(body.reviews).toBeSortedBy("created_at", {
              ascending: true,
            });
          });
      });
      test("p and limit query work", () => {
        return request(app)
          .get("/api/reviews?limit=2")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeInstanceOf(Array);
            expect(body.reviews).toHaveLength(2);

            expect(body.reviews).toEqual([
              {
                owner: "mallionaire",
                title: "Mollit elit qui incididunt veniam occaecat cupidatat",
                review_id: 7,
                category: "social deduction",
                review_img_url:
                  "https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                created_at: "2021-01-25T11:16:54.963Z",
                votes: 9,
                designer: "Avery Wunzboogerz",
                comment_count: 0,
              },
              {
                owner: "mallionaire",
                title: "Dolor reprehenderit",
                review_id: 4,
                category: "social deduction",
                review_img_url:
                  "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                created_at: "2021-01-22T11:35:50.936Z",
                votes: 7,
                designer: "Gamey McGameface",
                comment_count: 0,
              },
            ]);
            expect(body.reviews).toBeSortedBy("created_at", {
              descending: true,
            });

            expect(body.total_count).toBe(13);
          });
      });

      test("limit query works", () => {
        return request(app)
          .get("/api/reviews?p=1&&limit=2")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeInstanceOf(Array);
            expect(body.reviews).toHaveLength(2);

            expect(body.reviews).toEqual([
              {
                owner: "mallionaire",
                title: "Dolor reprehenderit",
                review_id: 4,
                category: "social deduction",
                review_img_url:
                  "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                created_at: "2021-01-22T11:35:50.936Z",
                votes: 7,
                designer: "Gamey McGameface",
                comment_count: 0,
              },
              {
                owner: "mallionaire",
                title: "Scythe; you're gonna need a bigger table!",
                review_id: 12,
                category: "social deduction",
                review_img_url:
                  "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
                created_at: "2021-01-22T10:37:04.839Z",
                votes: 100,
                designer: "Jamey Stegmaier",
                comment_count: 0,
              },
            ]);

            expect(body.reviews).toBeSortedBy("created_at", {
              descending: true,
            });

            expect(body.total_count).toBe(13);
          });
      });

      test("all queries work together", () => {
        return request(app)
          .get(
            "/api/reviews?order=asc&sort_by=title&category=social deduction&limit=5"
          )
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeInstanceOf(Array);
            expect(body.reviews).toHaveLength(5);

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
                comment_count: expect.any(Number),
              });
            });

            expect(body.reviews).toBeSortedBy("title", { ascending: true });

            expect(body.total_count).toBe(11);
          });
      });

      test("if invalid sort input given, return error", () => {
        return request(app)
          .get("/api/reviews?sort_by=hello")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid sort query");
          });
      });

      test("if invalid order input given, return error", () => {
        return request(app)
          .get("/api/reviews?order=hello")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid order query");
          });
      });

      test("if invalid order input given, return error", () => {
        return request(app)
          .get("/api/reviews?category=hello")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Given category does not exist");
          });
      });

      test("if invalid query is given, return error", () => {
        return request(app)
          .get("/api/reviews?name=asc")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid query");
          });
      });

      test("should give error if the p query input is not int", () => {
        return request(app)
          .get("/api/reviews?limit=susana")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("limit queries need to be of type int");
          });
      });

      test("should give error if the p query input is not int", () => {
        return request(app)
          .get("/api/reviews?p=susana")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("p queries need to be of type int");
          });
      });
    });
  });

  describe("post request", () => {
    test("should post a new review with all properties", () => {
      const newReview = {
        owner: "bainesface",
        title: "Catan",
        review_body: "Great Stuff",
        designer: "Susana",
        category: "euro game",
      };

      return request(app)
        .post("/api/reviews")
        .send(newReview)
        .expect(201)
        .then(({ body }) => {
          expect(body.review).toMatchObject({
            review_id: 14,
            title: "Catan",
            category: "euro game",
            designer: "Susana",
            owner: "bainesface",
            review_body: "Great Stuff",
            review_img_url: "url",
            created_at: expect.any(String),
            votes: 0,
            comment_count: 0,
          });
        });
    });

    test("should return 400 if theres missing keys in the input body", () => {
      const newReview = {
        owner: "bainesface",
        title: "Catan",
        review_body: "Great Stuff",
        designer: "Susana",
      };

      return request(app)
        .post("/api/reviews")
        .send(newReview)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Input data format was not correct");
        });
    });

    test("irrelevant keys from the input body are ignored", () => {
      const newReview = {
        owner: "bainesface",
        title: "Catan",
        review_body: "Great Stuff",
        designer: "Susana",
        category: "euro game",
        hello: "new",
      };

      return request(app)
        .post("/api/reviews")
        .send(newReview)
        .expect(201)
        .then(({ body }) => {
          expect(body.review).toMatchObject({
            review_id: 14,
            title: "Catan",
            category: "euro game",
            designer: "Susana",
            owner: "bainesface",
            review_body: "Great Stuff",
            review_img_url: "url",
            created_at: expect.any(String),
            votes: 0,
            comment_count: 0,
          });
        });
    });

    test("if the owner is not an existent user, give error", () => {
      const newReview = {
        owner: "me",
        title: "Catan",
        review_body: "Great Stuff",
        designer: "Susana",
        category: "euro game",
        hello: "new",
      };

      return request(app)
        .post("/api/reviews")
        .send(newReview)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Bad request: Referenced parameter does not exist"
          );
        });
    });

    test("if the ocategory given does not exist, give error", () => {
      const newReview = {
        owner: "me",
        title: "Catan",
        review_body: "Great Stuff",
        designer: "Susana",
        category: "game",
      };

      return request(app)
        .post("/api/reviews")
        .send(newReview)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Bad request: Referenced parameter does not exist"
          );
        });
    });
  });
});

describe("/api/reviews/:review_id", () => {
  describe("get request ", () => {
    test("returns the review of the id given", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toMatchObject({
            category: "euro game",
            created_at: "2021-01-18T10:00:20.514Z",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_body: "Farmyard fun!",
            review_id: 1,
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            title: "Agricola",
            votes: 1,
            comment_count: 0,
          });
        });
    });

    test("should return the number of comments for a review with comments", () => {
      return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toMatchObject({
            category: "social deduction",
            created_at: "2021-01-18T10:01:41.251Z",
            designer: "Akihisa Okui",
            owner: "bainesface",
            review_body: "We couldn't find the werewolf!",
            review_id: 3,
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            title: "Ultimate Werewolf",
            votes: 5,
            comment_count: 3,
          });
        });
    });

    test("should give error if id given is out of range", () => {
      return request(app)
        .get("/api/reviews/100")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("ID does not exist");
        });
    });

    test("should give error if id given is out of range", () => {
      return request(app)
        .get("/api/reviews/hello")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Invalid parameter");
        });
    });
  });

  describe("patch request", () => {
    test("should update votes of the review ", () => {
      const updateInfo = {
        inc_votes: 1,
      };

      return request(app)
        .patch("/api/reviews/1")
        .send(updateInfo)
        .expect(201)
        .then(({ body }) => {
          expect(body.review).toMatchObject({
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: expect.any(String),
            votes: 2,
          });
        });
    });

    test("should give error if the body input does not match the object format ", () => {
      const updateInfo = {
        votes: 1,
      };

      return request(app)
        .patch("/api/reviews/1")
        .send(updateInfo)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Input data format was not correct");
        });
    });

    test("give error if given id is out of bounds is given", () => {
      const updateInfo = {
        inc_votes: 1,
      };

      return request(app)
        .patch("/api/reviews/100")
        .send(updateInfo)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("ID does not exist");
        });
    });

    test("give error if invalid type id is given", () => {
      const updateInfo = {
        inc_votes: 1,
      };

      return request(app)
        .patch("/api/reviews/hello")
        .send(updateInfo)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid parameter");
        });
    });

    test("ignores extra unnecessary information if given", () => {
      const updateInfo = {
        inc_votes: 10,
        designer: "Susana",
      };

      return request(app)
        .patch("/api/reviews/1")
        .send(updateInfo)
        .expect(201)
        .then(({ body }) => {
          expect(body.review).toMatchObject({
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: expect.any(String),
            votes: 11,
          });
        });
    });

    test("works ith decreasing number of votes", () => {
      const updateInfo = {
        inc_votes: -1,
      };

      return request(app)
        .patch("/api/reviews/1")
        .send(updateInfo)
        .expect(201)
        .then(({ body }) => {
          expect(body.review).toMatchObject({
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: expect.any(String),
            votes: 0,
          });
        });
    });

    test("works ith decreasing number of votes into negative voting", () => {
      const updateInfo = {
        inc_votes: -10,
      };

      return request(app)
        .patch("/api/reviews/1")
        .send(updateInfo)
        .expect(201)
        .then(({ body }) => {
          expect(body.review).toMatchObject({
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: expect.any(String),
            votes: -9,
          });
        });
    });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  describe("get request", () => {
    test("get all comments of the review with the given id", () => {
      return request(app)
        .get("/api/reviews/3/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toBeInstanceOf(Array);
          expect(body.comments).toHaveLength(3);

          expect(body.comments).toBeSortedBy("created_at", {
            descending: true,
          });

          body.comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: 3,
            });
          });
        });
    });

    test("get only n comments if limit query is given", () => {
      return request(app)
        .get("/api/reviews/3/comments?limit=1")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toBeInstanceOf(Array);
          expect(body.comments).toHaveLength(1);

          expect(body.comments).toBeSortedBy("created_at", {
            descending: true,
          });

          expect(body.comments[0]).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 3,
          });
        });
    });

    test("get the offset comments if p is given", () => {
      return request(app)
        .get("/api/reviews/3/comments?p=1&limit=1")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toBeInstanceOf(Array);
          expect(body.comments).toHaveLength(1);

          expect(body.comments[0]).toMatchObject({
            comment_id: 3,
            body: "I didn't know dogs could play games",
            review_id: 3,
            author: "philippaclaire9",
            votes: 10,
            created_at: "2021-01-18T10:09:48.110Z",
          });
        });
    });

    test("should give error if id given is out of range", () => {
      return request(app)
        .get("/api/reviews/100/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("ID does not exist");
        });
    });

    test("should give error if given parameter is invalid", () => {
      return request(app)
        .get("/api/reviews/hello/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Invalid parameter");
        });
    });

    test("should return empty array if no comments in specific review_id", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });

    test("should  give error, if limit query input is incorrect", () => {
      return request(app)
        .get("/api/reviews/3/comments?limit=me")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual('limit queries need to be of type int');
        });
    });

    test("should  give error, if p query input is incorrect", () => {
      return request(app)
        .get("/api/reviews/3/comments?p=me")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual('p queries need to be of type int');
        });
    });
  });

  describe("post request", () => {
    test("posts the new comment with a status code of 201", () => {
      const newComment = {
        author: "bainesface",
        body: "EPIC board game!",
      };

      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 7,
            review_id: 1,
            votes: 0,
            created_at: expect.any(String),
            ...newComment,
          });
        });
    });

    test("if unnecessary information is given, it is ignored", () => {
      const newComment = {
        author: "bainesface",
        body: "EPIC board game!",
        review_id: 50,
      };

      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 7,
            review_id: 1,
            votes: 0,
            created_at: expect.any(String),
            author: "bainesface",
            body: "EPIC board game!",
          });
        });
    });

    test("give appropriate error if author does not exist", () => {
      const newComment = {
        author: "Susana",
        body: "EPIC board game!",
      };

      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Bad request: Referenced parameter does not exist"
          );
        });
    });

    test("when the review_id does not exist, give appropriate error", () => {
      const newComment = {
        author: "bainesface",
        body: "EPIC board game!",
      };

      return request(app)
        .post("/api/reviews/100/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Bad request: Referenced parameter does not exist"
          );
        });
    });

    test("when the review_id is not given correctly as int", () => {
      const newComment = {
        author: "bainesface",
        body: "EPIC board game!",
      };

      return request(app)
        .post("/api/reviews/hello/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid parameter");
        });
    });

    test("give error if one of the required keys is not given", () => {
      const newComment = {
        author: "bainesface",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Input data format was not correct");
        });
    });
  });
});

describe("/api/users", () => {
  describe("get request", () => {
    test("that the returned array objects have the correct properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          body.users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });

    test("wrong url input to the request", () => {
      return request(app)
        .get("/api/user")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Route not found");
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("delete request", () => {
    test("should delete the comment given an id and return not content", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });

    test("if given an id that does not exist, give error", () => {
      return request(app)
        .delete("/api/comments/15")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No comment with given id");
        });
    });

    test("if given an id that does not exist, give error", () => {
      return request(app)
        .delete("/api/comments/hello")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid parameter");
        });
    });
  });

  describe("patch request", () => {
    test("should add a vote in the given id", () => {
      const voteUpdate = {
        inc_votes: 1,
      };
      return request(app)
        .patch("/api/comments/1")
        .send(voteUpdate)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 1,
            body: "I loved this game too!",
            review_id: 2,
            author: "bainesface",
            votes: 17,
            created_at: "2017-11-22T12:43:33.389Z",
          });
        });
    });

    test("should reduce a vote in the given id", () => {
      const voteUpdate = {
        inc_votes: -2,
      };
      return request(app)
        .patch("/api/comments/1")
        .send(voteUpdate)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 1,
            body: "I loved this game too!",
            review_id: 2,
            author: "bainesface",
            votes: 14,
            created_at: "2017-11-22T12:43:33.389Z",
          });
        });
    });

    test("if the required body parameters are given, give an error", () => {
      const voteUpdate = {
        hello: 1,
      };
      return request(app)
        .patch("/api/comments/1")
        .send(voteUpdate)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Input data format was not correct");
        });
    });

    test("give error if given id is out of bounds is given", () => {
      const updateInfo = {
        inc_votes: 1,
      };

      return request(app)
        .patch("/api/comments/100")
        .send(updateInfo)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No comment with given id");
        });
    });
  });
});

describe("/api", () => {
  test("should return the json file", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endPoints);
      });
  });
});

describe("/api/users/username", () => {
  describe("get request", () => {
    test("test that it returns the user with the given username", () => {
      return request(app)
        .get("/api/users/bainesface")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).toBeInstanceOf(Object);
          expect(body.user).toMatchObject({
            username: "bainesface",
            name: "sarah",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          });
        });
    });

    test("if invalid username is given, throw error", () => {
      return request(app)
        .get("/api/users/1hello")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User with username given does not exist");
        });
    });
  });
});
