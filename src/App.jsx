import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [product, setProduct] = useState({
    id: '',
    name: '',
    os: '',
    price: ''
  });

  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Local storage key
  const STORAGE_KEY = 'crud_front_products';

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate basic fields
    if (!product.id || !product.name || !product.os || !product.price) {
      alert('Please fill in all fields.');
      return;
    }

    // Load existing from localStorage
    const current = loadProducts();

    if (isEditing) {
      // Update existing by id
      const idx = current.findIndex((p) => String(p.id) === String(product.id));
      if (idx === -1) {
        alert('Item not found for update.');
        return;
      }
      const updated = [...current];
      updated[idx] = { ...product };
      saveProducts(updated);
      setProducts(updated);
      alert('Update successful (local)');
      setIsEditing(false);
    } else {
      // Prevent duplicate IDs
      const exists = current.some((p) => String(p.id) === String(product.id));
      if (exists) {
        alert('ID already exists. Please use a unique ID.');
        return;
      }
      const updated = [...current, { ...product }];
      saveProducts(updated);
      setProducts(updated);
      alert('Insert successful (local)');
    }

    // Reset form
    setProduct({ id: '', name: '', os: '', price: '' });
  };

  const fetchProducts = () => {
    setProducts(loadProducts());
  };

  const editProduct = (p) => {
    setProduct(p);
    setIsEditing(true);
  };

  // Optional delete logic can be added later if needed.

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
      <div className="form-container">
        <h2 className="text-center mb-4">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group row">
            <label htmlFor="id" className="col-sm-3 col-form-label form-label">ID:</label>
            <div className="col-sm-9">
              <input
                type="number"
                name="id"
                id="id"
                className="form-control"
                value={product.id}
                onChange={handleChange}
                required
                disabled={isEditing}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="name" className="col-sm-3 col-form-label form-label">Name:</label>
            <div className="col-sm-9">
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="os" className="col-sm-3 col-form-label form-label">OS:</label>
            <div className="col-sm-9">
              <input
                type="text"
                name="os"
                id="os"
                className="form-control"
                value={product.os}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="price" className="col-sm-3 col-form-label form-label">Price:</label>
            <div className="col-sm-9">
              <input
                type="text"
                name="price"
                id="price"
                className="form-control"
                value={product.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="text-center mt-3">
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update' : 'Insert'}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setIsEditing(false);
                  setProduct({ id: '', name: '', os: '', price: '' });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h3 className="text-center">Product List</h3>
      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>OS</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.os}</td>
              <td>{p.price}</td>
              <td className="actions-cell">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => editProduct(p)}
                >
                  Edit
                </button>
                {/* Enable delete by uncommenting if desired */}
                {/* <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteProduct(p.id)}
                >
                  Delete
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

// Helpers for local storage persistence
function loadProducts() {
  try {
    const raw = localStorage.getItem('crud_front_products');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProducts(list) {
  try {
    localStorage.setItem('crud_front_products', JSON.stringify(list));
  } catch {
    // ignore write errors
  }
}
