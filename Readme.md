node v24

backend:
install
 postgresql:
brew install postgresql@16
brew services start postgresql@16
psql --version


Architecture:
React → JSON → Django view → ORM → PostgreSQL

frontend : the payload of request doesn't need account info, because it will always be Admin user.

UI: Single-page Frontend web, React+Typescript
controller: Restful APIs endpoints, Python (getCommentsList, deleteComment, addComment, editComment, editLikes)
service: (getCommentsList, deleteComment, addComment, editComment, editLikes)
model: Users, Comments, Likes, Images

In frontend,
Under src/, I devided the api requests, request hooks, types and components parts for easy maintainance.