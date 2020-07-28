#!/usr/bin/env node

import "reflect-metadata";
import { Container } from "./inversify/Container";
import { App } from "./App";

// Set up container
const container: Container = new Container();
container.bind<App>(App.name).to(App).inSingletonScope();

// Get and run app
const app: App = container.get<App>(App.name);
app.run();
