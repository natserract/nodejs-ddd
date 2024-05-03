# NodeJS - DDD & CA Architecture

This is my implementation of [DDD (Domain Driven Design)](https://khalilstemmler.com/articles/domain-driven-design-intro/) & [CA (Clean Architecture)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) architectures. The goals of this project are for enterpise applications that prioritize simplicity and modeling code as close to the business domain as possible. This results in code that can be easily understood by the business and evolve with the changing needs of the business domain.

> Disclaimer: There is no such architecture that fits all. Every software development architecture or pattern has pros and cons; base your decision on the project, the scope, and the team.

By isolating the domain code from all other issues of the system such as infrastructure, security, transport, serialization, etc.; the complexity of the system grows only as large as the complexity of the business or domain problem itself.

## Domain Driven Design (DDD) & Clean Architecture (CA)

### **Domain-Driven Design (DDD)**

**Domain-Driven Design (DDD)** is the approach to software development which enables us to translate complex problem domains into rich, expressive and evolving software. It's the way we design applications when the needs of our users are complex.

Domain-driven design (DDD) is the concept that the structure and language of your code (class names, class methods, class variables) should match the business domain. For example, if your software processes loan applications, it might have classes such as LoanApplication and Customer, and methods such as AcceptOffer and Withdraw.

Domain-driven design (DDD) is divided into **[strategic patterns](https://thedomaindrivendesign.io/what-is-strategic-design/)** and **[tactical patterns](https://thedomaindrivendesign.io/what-is-tactical-design/)**. The strategic pattern consists of things like bounded context, ubiquitous language, and context map; the tactical pattern consists of concepts like value types, entities, and aggregate

> So you have received your 100 pages of the requirements doc and a presentation has been made about your new project. Now as a developer your job is to translate the business requirements to your code. But where do we start? Architecture you say? System diagrams? Project structure? How about starting from discovering and translating the domain? I assume you are familiar or at least or the term Domain Driven Design.

Domain driven design is not about the layers, is not about your architecture, not about your objects or entities (although entity is fundamental concept in DDD). Domain driven design is about deriving your design from the business domain. We try to build such an *aligment* between the source code and the other stakeholders, we invent our domain language, that is Ubiquitous Language.

### **Clean Architecture**

**Clean Architecture** is a way of thinking about software architecture that emphasizes the **separation of concerns** between different layers of an application. It was developed by software engineer and author **Robert C. Martin**, also known as **Uncle Bob**, as a response to the increasing complexity of modern software systems.

At the heart of Clean Architecture is the idea that the business logic of an application should be entirely separate from the technologies used to implement it. This means that the core functionality of an application should be **independent** of **any external concerns**, such as databases, frameworks, and even the user interface.

> If we're building an app that helps recruiters hire talent, we need to spend some time understanding the domain language and processes that exist from the recruiters' perspective.

## When and why you don't need DDD or CA

Here's when and why you might choose not to use DDD or CA:

1. **Small Applications or Prototypes**: For small-scale applications, prototypes, or proof-of-concept projects where the primary goal is to validate an idea quickly, the extensive upfront investment in modeling and design required by DDD may slow down the development process unnecessarily.

2. **Lack of Domain Complexity**: DDD is particularly valuable in scenarios with high domain complexity. If the domain is not complex, the benefits of DDD diminish, and simpler development approaches could suffice and be more cost-effective.

3. **Limited Resources or Expertise**: DDD requires a certain level of expertise and experience, both in terms of software design and understanding the business domain. If a team lacks this expertise or is constrained in resources, implementing DDD might lead to suboptimal results.

4. **Rapid Market Changes**: In industries where market conditions and business requirements change rapidly, the time and effort invested in deep domain modeling may not pay off if the model becomes obsolete quickly.

5. **Overhead for Small Teams**: Small development teams might find the overhead of DDD's practices and abstractions burdensome, especially if they can achieve their goals with simpler methodologies.

6. **Short-Lived Applications**: For applications that are intended to be temporary or have a short lifespan, the investment in a DDD approach may not provide sufficient return on investment.

7. **Limited Collaboration with Domain Experts**: Successful DDD implementation requires close collaboration with domain experts. If such collaboration is not feasible or if domain expertise is not readily available, the benefits of DDD can be severely limited.

8. **When YAGNI (You Aren’t Gonna Need It) Applies**: Sometimes, over-engineering a solution can be a pitfall. DDD might lead to complex designs where a simpler solution would suffice. This is especially true in cases where future requirements are uncertain or speculative.

9. **Projects with Well-Defined Frameworks or Libraries**: If a project primarily involves integrating existing frameworks or libraries with minimal domain complexity, the DDD approach may not add significant value.

### So why using DDD ?

1. **Alignment with Business Needs**: DDD emphasizes close collaboration with domain experts to ensure the software accurately reflects real-world scenarios and business logic. This alignment helps create more relevant and effective software solutions that directly address business needs.

2. **Complexity Management**: DDD is adept at managing complex domains by structuring and organizing the domain model effectively. It helps break down a complex domain into more manageable parts (like Aggregates, Entities, Value Objects), making it easier to work with and understand.

3. **Improved Communication**: By using a ubiquitous language that is shared between developers and domain experts, DDD promotes clearer communication. This language is based on the domain itself, reducing misunderstandings and ambiguities in discussions and in the codebase.

4. **Focus on Core Business Concepts**: DDD encourages focusing on the core domain and its logic, rather than getting distracted by peripheral or technical concerns. This focus ensures that the most valuable and critical aspects of the software are given priority.

5. **Enhanced Flexibility and Scalability**: The modular nature of DDD makes it easier to scale and evolve the system over time. Changes in one part of the domain model can often be made with minimal impact on other parts, which is crucial for long-term maintenance and evolution.

6. **Facilitates Iterative Development**: DDD is well-suited to agile and iterative development processes. It allows for evolving models and continuous refinement based on real-world feedback, which is vital for adapting to changing business requirements.

7. **Better Domain Insights**: DDD helps uncover deeper insights into the domain, which can lead to more innovative solutions. Through the process of exploring and modeling the domain, hidden concepts and relationships often emerge, providing valuable new perspectives.

8. **Reduced Risk of Failure**: By ensuring that the software closely matches the domain complexities and business requirements, DDD reduces the risk of building the wrong thing. This alignment with business needs is crucial for delivering successful software projects.

9. **Long-term Maintainability**: A well-structured DDD application tends to be more maintainable in the long run. The separation of concerns, clear boundaries, and explicit models all contribute to a codebase that is easier to understand, modify, and extend.

10. **Suitability for Complex Systems**: DDD excels in situations where the domain is complex and the cost of failure is high. In such scenarios, the benefits of a deep understanding of the domain and a model that faithfully represents it are particularly significant.

## Architecture Layers

Layering is a common practice to separate and organise code units by their role/responsibilities in the system.

1. **Domain**: The domain represents the problem space and the core of the application. It includes the entities, value objects, and business rules that define the behavior and constraints of the application. It shouldn’t depend on any layer or third-party library or framework. `domain layer === business logic`
2. **Business Rules**: Business rules encapsulate the specific behavior and constraints of the domain. These rules are often complex and subject to change. By separating business rules from other concerns, such as application logic or infrastructure details, we can achieve a more flexible and maintainable codebase.
3. **Application Rules**: Application rules define the behavior and workflow of the application. They serve as a bridge between the domain and the infrastructure, orchestrating the interactions between different domain objects and handling application-specific concerns.
4. **Infrastructure**: Infrastructure refers to the technical components that support the application, such as databases, external services, frameworks, and libraries. Separating the infrastructure from the core domain and application logic allows for easier maintenance and testing. It contains any database, IO, or network implementations, such as MongoDB, Postgres, Analytical services, Controllers, File system access, or memory cache.

## DDD & CA Components

### **Repositories:**

Repositories are classes or components that encapsulate the logic required to access data sources. They centralize common data access functionality, providing better maintainability and decoupling the infrastructure or technology used to access databases from the domain model layer. For each aggregate or aggregate root, you should create one repository class.

### **Controllers:**

A controller receives the request, maps it to the Application model, calls the appropriate application use case, and maps the result to the desired response entity. The controller converts the request into a request model and passes it to the use case interactor through its input port.

Such request objects are usually simple data transfer objects (DTO). Depending on the view technology a request object may contain typed information (e.g. WPF) or just strings (e.g. HTML). It is the role of the controller to convert the given information into a format which is most convenient for and defined by the use case interactor. For that the controller may have some simple if-then-else or parser logic but we do not want to have any processing logic inside the controller.

Finally the controller simply calls an API on the use case interactor to trigger the processing.

### **Data Transfer Object:**

DTOs are used for transferring data between different layers of an application, often between the application’s backend and frontend. They are lightweight objects designed to carry data and do not contain any domain logic. DTOs help in reducing the amount of data transferred and provide a clear contract between different layers.

### **Models:**

The term “Model” is quite generic and can refer to various things based on the context. In some cases, it might be used interchangeably with Domain Objects or Entities. However, in a broader context, the “Model” can refer to the representation of data that is used within the application. This can include both Domain Objects and DTOs.

### **Use Case:**

In **Clean Architecture**, a use case is a piece of business logic that represents a single task that the system needs to perform. The use case encapsulates the rules and logic required to perform the task, and defines the inputs and outputs required for the operation.

The use case is typically implemented as a standalone module (class or function), which is responsible for coordinating the flow of data between different layers of the system, such as the domain layer and the presentation layer. The use case is often triggered by a user action (clicking of a button) or an event (API call) in the system, and can result in changes to the state of the system or the data that is stored or retrieved.

Difference between a use case and a controller: Controllers use use-cases, and use cases use repositories\*\* domains are within a use case as well as repos

There are **three** **use case** types:

1. **Request to do something** (CreateShipment, UpdateShipmentStatus)
2. **Query something** (GetShipments)
3. **Event Handler** (OrderReceivedEventHandler)

## Domain Components

### **Aggregates**

An aggregate represents a cluster of related objects treated as a single unit. In this use case, the "Product" entity can be considered an aggregate root, encapsulating the product details and maintaining consistency within its boundaries.

Aggregate Roots are *special* **Entities** with additional responsibilities: encapsulating other domain objects (e.g. **Entity** and **ValueObjects**) and controlling their access/visibility to the outside world. Aggregate roots extend the Entity API outlined above, adding support for their additional responsibilities.

An *Aggregate* is a Cluster of one or more *Entities*, and may also contain *Value Objects*. The Parent *Entity* of this Cluster receives the name of *Aggregate Root*.

If a business transaction needs a reference to other entities in relation, aggregates should be used instead (aggregates can hold a reference to other aggregate roots, which are entity classes by definition)

### **Value Objects (VOs)**

The product details such as title, description, price, and quantity can be modeled as value objects. They are immutable and provide behavior and validation rules specific to their attributes.

Value objects responsible for handling validation logic Where do we handle domain logic - as close to the entity as possible, otherwise domains ervices Repositories, Data Mappers, DTOs are tools to help us store, create, and delete domain entities - also known as data access logic must encapsulate data access logic

What differentiates a *Value Object* from an *Entity* is that, *Value Objects* are immutable and do not have a unique identity, are defined only by the values of their attributes.

Prefer to put the behavior on value objects rather than on entities because value objects are immutable and do not have side effects (like changing their state or changing the state of any entity)

### **Entity**

An *Entity* is a potentially changeable object, which has a unique identifier. *Entities* have a life of their own within their *Domain Model*, which enables you to obtain the entire transition history of this *Entity*. Entities are a form of an object that represents something meaningful to our particular business domain. Domain objects that may have an id. We model an entity using a class

> Assume that we have a social network and have entities like Post, Like, Comment, Tag. (I believe you can imagine the relations between these entities) Some of the entities are "Aggregate Root". To find the aggregate root(s) I try to find which entities cannot live without the other. For instance, Like or Comment cannot live without a Post. Then Post is an aggregate root and we need a PostRepository or turn the Post entity into a Repository (the famous collection like interface thing).

> **Entities should be the first place that we think of to put domain logic**

### Factory Pattern

A [Factory](https://culttt.com/2014/12/24/factories-domain-driven-design) is an object that has the single responsibility of creating other objects. In either case, when something has the responsibility for creating another object, it’s called a **Factory**.

The factory pattern in DDD can be seen as a super pattern for the Gang of Four (GoF) creational patterns. The factory pattern is responsible for the creation of complex objects like aggregates.

> For example, we might have a payment gateway Factory that should provide a class for accepting payments from customers to any one of many payment gateways.

#### Why Is It So Important?

The Factory Design Pattern is pivotal for three primary reasons:

1. Loose coupling: The factory encapsulates the creation details and returns an instance of a common interface, ensuring that the main application isn’t tightly bound to the specific object types.
2. Code reusability and modularity: Centralizing object creation in a single place naturally promotes reusability. It also makes the system more modular since any changes in object creation only affect the factory, not the consumer.
3. Flexibility and scalability: When a new object type needs to be added, only the factory needs an update. The consumer code remains untouched, making the system scalable and easy to maintain.

#### When Should We Use It?

Factory Pattern shines in scenarios where:

- A class cannot anticipate the type of objects it needs to create.
- A class delegates responsibilities to helper subclasses, and the knowledge of which helper class is the best suited for the job needs to be localized.
- Objects created share a common interface, but their specific type might be determined at runtime.

#### How to use factories?

When using factories for aggregates in DDD, there are certain practices and patterns to follow. Complex or domain knowledge-requiring creation processes should be handled by factories, while simple or trivial aggregates can be created directly by the client or by a constructor. **Factories should be part of the domain layer, not the application or infrastructure layer**, and should be aligned with the domain model and the ubiquitous language instead of technical details or external systems. Additionally, factories should act as collaborators, not controllers, and should only create aggregates and return them to the client. Factories can be implemented as static methods, classes, or services depending on design trade-offs and preferences; static methods are simple and convenient but cannot be injected or mocked, classes are more flexible and testable but require more boilerplate code, and services are more abstract and decoupled but introduce complexity and overhead.

#### Strategy Pattern

The Strategy pattern allows us to dynamically swap out algorithms (i.e. application logic) at runtime. Strategy design pattern is a behavioural design pattern that allows a class to switch/run an algorithm at runtime. Instead of implementing a single algorithm directly, your class receives run-time instructions as to which strategy to use in a family of algorithms.

![](https://media.licdn.com/dms/image/D4E12AQEewQ7rcKVNPg/article-inline_image-shrink_1500_2232/0/1704809593689?e=1717632000&v=beta&t=KEJn5yttVYS8dq1tNCbMkHx2XQDmiDCD5qluIeSGyTo)

> The Factory and Strategy patterns are not about simplifying the code but rather **about organizing it in a way that makes it more maintainable, scalable, flexible, and testable, especially as the size and complexity of the software grow**.

### **Events / Domain Event**

*Events* indicate significant occurrences that have occurred in the domain and need to be reported to other stakeholders belonging to the domain. It is common for *Aggregates* to publish events.

Domain Events enable decoupling parts (e.g. "sub domains") of your application.

## OOP Programming Concepts

OOP is about decomposing problems into smaller classes and modules, bite-sized chunks of logic. When it comes to software development, there are two key ideas that regularly come up in discussions about writing decoupled, simple-to-maintain code. Known as Dependency Inversion and Dependency Injection, these ideas address many facets of object-oriented programming.

### Dependency injection (DI abbreviated)

Dependency injection (DI abbreviated) is a technique that **removes internal dependencies** from the implementation by enabling these dependencies to be injected externally. All of this is a subset of Inversion of Control Principle (IoC abbreviated). It’s a technique where objects receive their dependencies from an **external source** rather than creating them internally. This external source can be provided through constructors, properties, or methods.

**Three Types of Dependency Injection:**

1. **Constructor Injection**
2. **Setter Injection**
3. **Interface Injection**

### **Dependency Inversion**

**Dependency Inversion** is a *design principle* that guides the structure of your code. **Dependency Inversion is a** design principle that suggests **high-level modules** or **classes** **should not depend on low-level modules** but **both should depend on abstractions**. It also states that **abstractions should not depend on details; details should depend on abstractions.**

**Dependency Inversion** is a principle proposed by **Robert C. Martin (Uncle Bob)** as part of the SOLID principles. It suggests that high-level modules should not depend on low-level modules; both should depend on abstractions. Abstractions should not depend on details; details should depend on abstractions.

### **Understanding Dependency Lifetimes**

1. **Transient:**
   Transient lifetime means that a new instance of the dependency is created every time it is requested or injected into a consuming class. This scope is suitable for stateless services or components that do not hold state across multiple requests. With transient lifetime, a new instance is created on every request for that particular dependency.
2. **Singleton:**
   Singleton lifetime means that the container maintains a single instance of the dependency throughout the application’s lifetime. This instance is reused whenever the dependency is requested, ensuring that all parts of the application share the same instance.
3. **Scoped:**
   Scoped lifetime means that a single instance of the dependency is created once per scope or per request. In the case of web applications, this scope often aligns with an HTTP request. Within the same HTTP request, the same instance is reused, but subsequent requests receive their own instances.

### Meet **TSyringe**

In any large object oriented codebase, managing dependencies can get difficult. Each class can require any number of third parties or other classes to function, and it can be hard to test the behavior of a single class with mocks if those dependencies aren’t easy to provide.

When you need to test a particularly complicated class, setting up all its dependencies can take more time that writing the test itself! If you only need to mock a single subdependency, you need to instantiate everything all the way down until the mock is required, and then pass it in there.

[Tysringe](https://github.com/microsoft/tsyringe) is a lightweight dependency injection container for TypeScript/JavaScript for constructor injection. Allows you to tag a particular dependency as injectable with a decorator, and then very easily get an instance of it.

At its core, [tsyringe](https://github.com/microsoft/tsyringe) provides you a dependency container that keeps track of all your dependencies. When you need to create an instance of a class, you can call `resolve` on the the container with an *injection token* and it will return you the right dependency registered under that token.

Adding tsyringe has definitely made managing our application dependencies and testing code much easier, with a dependency injection framework, we now have a much more manageable solution to dealing with our large dependency tree.

## What's inside?

- [x] KoaJS
- [x] Sequelize
- [x] Inversion of Control (IoC) container
- [x] Sentry
- [ ] Chai

## Good to reads:

- https://medium.com/@harry9.11.1985/domain-driven-design-domain-model-and-its-implementation-4878082e38e1
- https://www.dddcommunity.org/wp-content/uploads/files/pdf_articles/Vernon_2011_1.pdf
- https://alexkondov.com/tao-of-node/
- [https://www.thoughtworks.com/en-au/insights/blog/architecture/domain-driven-design-in-functional-programming](https://www.thoughtworks.com/en-au/insights/blog/architecture/domain-driven-design-in-functional-programming)
- [https://bazaglia.com/clean-architecture-with-typescript-ddd-onion/](https://bazaglia.com/clean-architecture-with-typescript-ddd-onion/)
- [https://antman-does-software.com/functional-domain-driven-design-simplified](https://antman-does-software.com/functional-domain-driven-design-simplified)
- [https://medium.com/@alemarr/solid-principles-using-typescript-c475031efcd3](https://medium.com/@alemarr/solid-principles-using-typescript-c475031efcd3)
- [https://svatasimara.medium.com/domain-driven-design-part-8-services-and-factories-4c0dec11fdc1
  ](https://svatasimara.medium.com/domain-driven-design-part-8-services-and-factories-4c0dec11fdc1)
