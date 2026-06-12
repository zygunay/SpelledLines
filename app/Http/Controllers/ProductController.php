<?php

namespace App\Http\Controllers;
use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(){
        $products = Product::all();
        return Inertia::render('Products/index', compact('products'));
    }
    public function create(){
        return Inertia::render('Products/create', []);
    }
    public function store( Request $request){
    $request->validate([
    'name'=>'required|string|max:255',
    'price'=>'required|numeric',
    'description'=>'nullable|string'
    ]);
    Product::create($request->all());
    return redirect()->route('products.index') ->with('message','Product created successfully');
    }
    public function destroy(Product $product){
    $product->delete();
    return redirect()->route('products.index') ->with('message','Product deleted successfully'); 

    }
    public function edit(Product $product){
        return Inertia::render('Products/edit', compact('product'));
    }
public function update(Product $product, Request $request){
    $request->validate([
    'name'=>'required|string|max:255',
    'price'=>'required|numeric',
    'description'=>'nullable|string'
    ]);
    $product->update([
        'name' => $request->input('name'),
        'price' => $request->input('price'),
        'description' => $request->input('description')
    ]);
    return redirect()->route('products.index') ->with('message','Product updated successfully');
    }
}

