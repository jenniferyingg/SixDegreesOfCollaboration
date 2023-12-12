# Six Degrees Of Collaboration
This application allows you to provide two artists, and it efficiency finds a path between them through their collaborations. We built it using Next.js, connecting to Spotify's API, and implementing a Neo4j graph database.
Since a database can't store all of Spotify's millions of artists and tracks, we ran a script to fill it with about 100 top artists and their collaborations. When the user wants to find a path, our algorithm makes calls to Spotify's API to run two greedy best-first searches from the input artists to artists in the database, and then makes a call to Neo4j's shortestPath  function to run a breadth-first search through the database. Using both the Spotify API and maintaining a smaller database allows the user to start from even the most obscure artists and still finish the algorithm in a reasonable time.

<img width="800" alt="Screen Shot 2023-12-12 at 3 04 50 PM" src="https://github.com/jenniferyingg/six-degrees-of-collaboration/assets/84633669/d7c8170a-65c8-4cda-9f59-06e1c8ea416d">
<img width="800" alt="Screen Shot 2023-12-12 at 3 08 17 PM" src="https://github.com/jenniferyingg/six-degrees-of-collaboration/assets/84633669/62041357-fce8-4ad8-8644-68a369542876">

