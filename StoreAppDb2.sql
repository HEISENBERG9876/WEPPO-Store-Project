CREATE TABLE Users (
    Id SERIAL PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Is_Admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE Products (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Orders (
    Id SERIAL PRIMARY KEY,
    User_Id INT NOT NULL,
    Order_Date TIMESTAMP DEFAULT NOW(),
    Total_Price DECIMAL(10,2),
    FOREIGN KEY (User_Id) REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE TABLE Order_Items (
    Id SERIAL PRIMARY KEY,
    Order_Id INT NOT NULL,
    Product_Id INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    Price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (Order_Id) REFERENCES Orders(Id) ON DELETE CASCADE,
    FOREIGN KEY (Product_Id) REFERENCES Products(Id) ON DELETE CASCADE
);

CREATE TABLE Cart_Items (
    Id SERIAL PRIMARY KEY,
    User_Id INT NOT NULL,
    Product_Id INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    Price DECIMAL(10, 2) NOT NULL CHECK (Price > 0),
    FOREIGN KEY (User_Id) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (Product_Id) REFERENCES Products(Id) ON DELETE CASCADE
);
