async function deleteProduct(btn) {
  const productId = btn.parentNode.querySelector('[name=productId]').value
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value
  const productContainer = btn.closest('article')

  try {
    const req = await fetch(`/admin/product/${productId}`, {
      method: 'DELETE',
      headers: {
        'csrf-token': csrf
      }
    })
    const res = await req.json()
    productContainer.remove()
    console.log(res)
    // IE6 -> productContainer.parentNode.removeChild(productContainer)
  } catch (error) {
    console.log(error)
  }

}