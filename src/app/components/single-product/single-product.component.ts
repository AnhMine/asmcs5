import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import {
  _productsModel,
  products,
  productsDetal,
} from '../../model/products.model';
import { _cart } from '../../Shared/Cart.shared';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrl: './single-product.component.css',
})
export class SingleProductComponent implements OnInit {
  constructor(
    private pramaster: ActivatedRoute,
    private _products: ProductsService,
    private router: Router
  ) {}
  singleProduct?: productsDetal;
  products: products[] = [];
  quantity: number = 1;
  ngOnInit(): void {
    this.router.events.subscribe((envent) => {
      if (envent instanceof NavigationEnd) {
        this.LoadPage();
      }
    });
    this.LoadPage();
  }

  LoadPage() {
    let id: string = this.pramaster.snapshot.params['id'];
    this._products.getById(Number(id)).subscribe((response) => {
      this.singleProduct = response[0];
      this.Products(response[0].categoryId);
    });
  }

  Products(id: number) {
    this._products.getAllData().subscribe((response) => {
      let list = response.filter((a) => a.categoryId == id);
      this.products =
        list.length >= 4 ? list.slice(0, 4) : list.slice(0, list.length);
    });
  }
  // thêm sản phẩm vào giỏ hàng
  AddToCart(item: products) {
    _cart.AddToCartLocal('cart', item);
    window.location.reload();
  }
  ChangeQuantity(quantity: number, type?: string) {
    if (type) {
      if (quantity < 9) {
        this.quantity = quantity + 1;
      }
    } else {
      if (quantity > 1) {
        this.quantity = quantity - 1;
      }
    }
  }

  AddToCarts(item: productsDetal | undefined, quantity: number) {
    let newItem: products = _productsModel.CreateProdycts(
      item as productsDetal
    );
    let id = localStorage.getItem('id');
    if (id) {
      _cart.AddToCartLocal(
        `cart${id}`,
        newItem,
        quantity as number | undefined
      );
      alert('Thêm vào giỏ hàng thành công')
    } else {
      _cart.AddToCartLocal('cart', newItem, quantity as number | undefined);
      alert('Thêm vào giỏ hàng thành công')
    }
    window.location.reload();
  }
}
