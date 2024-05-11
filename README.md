<h3 align="center">IvoryBoard</h3>

  <p align="center">
    A Whiteboard application build on top of NATS Jetstream and Nats KV.



<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



## About The Project

![IvoryBoard][product-screenshot]

Instead of the usual websocket based backends, this project aims to leverage the existing feature sets make available by NATS (Message broker) which can be compared to KAFKA or Rabbit MQ which also supports persistance, message ordering and Key value storage including object storage.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Next][Next.js]][Next-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- npm or bun or yarn
- NATS setup (defaults to a hosted demo instance, change if required)
- "whiteboard.nats.*" streaming subject should be setup.

### Installation

1. Install NPM packages
   ```sh
   npm install
   ```
   or

    ```sh
   bun install
   ``` 
2. Run the server
   ```js
   npm run dev
   ```
   or 

   ```
   bun run dev
   ```


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Enter a roomname to initiate the a whiteboard session or enter an exisiting whiteboard name to join the session.

Click on sync to begin syncing with NATS

## Acknowledgments

* [NATS WS](https://github.com/nats-io/nats.ws)
* [Excalidraw](https://github.com/excalidraw/excalidraw)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/