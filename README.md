<h1 align="center">
  LogsTrap
</h1>

<img width="2032" alt="image" src="https://github.com/user-attachments/assets/7886024b-927b-415d-84f2-63d147bd0f72">


<h3 align="center">
  A powerful logging service for your applications.
</h3>

## Why?

I made this to use at work but then decided to host it as a separate entity too(we already selfhost our own private instance at work).


## Features

- Log API requests and responses
- Log errors and exceptions
- Provides a logger instance to your services
- AES 256 encryption for sensitive data like request payloads, response payloads, stack traces, etc.

## Adapters

- [Nestjs](./packages/nest)
- [Nextjs](./packages/next)
- [Express](./packages/express)


## Example
We dogfood our own service but if you want to see minimal examples. You can see [examples](./examples) directory

## Roadmap

Refer to projects tab for more information.

## ✨ Want to contribute?

Please see the [`LOCAL.md`](/LOCAL.md) on how to get set up.
