const apiURL = 'http://localhost:5000/api/products';

let editingProductId = null;
let products = []; 

async function fetchProducts() {
  try {
    const res = await fetch(apiURL);
    products = await res.json();

    let totalValue = 0;
    let lowStock = 0;

    const table = document.getElementById('product-table');
    table.innerHTML = '';

    products.forEach(product => {
      totalValue += product.price * product.quantity;
      if (product.quantity <= 5) lowStock++;

      const row = `
        <tr>
          <td>
            <strong>${product.name}</strong><br>
            <small>${product.description || ''}</small>
          </td>
          <td>${product.sku}</td>
          <td>${product.quantity} ${product.quantity <= 5 ? '⚠️' : ''}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td>${product.category || ''}</td>
          <td> <button onclick="editProduct('${product._id}')">Edit</button>
              <button onclick="deleteProduct('${product._id}')">Delete</button>
              </td>
        </tr>
      `;

      table.innerHTML += row;
    });

    document.getElementById('total-products').textContent = products.length;
    document.getElementById('low-stock').textContent = lowStock;
    document.getElementById('total-value').textContent = `$${totalValue.toFixed(2)}`;

  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function showAddProduct() {
    document.getElementById('product-form-modal').classList.remove('hidden');
  }
  
  function closeForm() {
    document.getElementById('product-form-modal').classList.add('hidden');
    document.getElementById('product-form').reset();
  }
  
  // Handle form submit
  document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const product = {
      name: document.getElementById('name').value,
      sku: document.getElementById('sku').value,
      quantity: parseInt(document.getElementById('quantity').value),
      price: parseFloat(document.getElementById('price').value),
      category: document.getElementById('category').value,
      description: document.getElementById('description').value
    };
  
    try {
      const url = editingProductId ? `${apiURL}/${editingProductId}` : apiURL;
      const method = editingProductId ? 'PUT' : 'POST';
  
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
  
      if (res.ok) {
        closeForm();
        fetchProducts();
      } else {
        alert('Failed to save product.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error saving product.');
    }
  });
  
  

fetchProducts();

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
  
    try {
      const res = await fetch(`${apiURL}/${id}`, {
        method: 'DELETE'
      });
  
      if (res.ok) {
        fetchProducts(); // Refresh the table
      } else {
        alert('Failed to delete product.');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Error deleting product.');
    }
  }

  function showAddProduct() {
    editingProductId = null;
    document.getElementById('product-form-modal').classList.remove('hidden');
  }
  
  
  function editProduct(id) {
    const product = products.find(p => p._id === id);
    if (!product) return;
  
    editingProductId = id;
    document.getElementById('name').value = product.name;
    document.getElementById('sku').value = product.sku;
    document.getElementById('quantity').value = product.quantity;
    document.getElementById('price').value = product.price;
    document.getElementById('category').value = product.category || '';
    document.getElementById('description').value = product.description || '';
    
    document.getElementById('product-form-modal').classList.remove('hidden');
  }
  