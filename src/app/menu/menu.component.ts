import {ApplicationModule, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {MenuServiceService} from "../menu-service.service";
import {AppComponent} from "../app.component";
import {count} from "rxjs/operators";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  model:menu[];
  values:Quantity[] = [];
  total:number=0;
  totalAmount:number=0;
  searchKey:string;
  oldMenu:menu[];

  modalCart:cart={
    quantity1:0,
    quantity2:0,
    quantity3:0
  };

  constructor(private http:HttpClient, private router:Router,
    private menuService:MenuServiceService) { }



  ngOnInit() {
    if (sessionStorage.getItem("userData") == null) {
      this.router.navigate(['login']);
    }
    this.getItems();
  }


  clearLocal(){
    sessionStorage.clear();
    this.router.navigate(['/home']);

  }

  getItems():void{
    this.menuService.getItems().subscribe((men: any[]) => {
      this.model = men;
      this.oldMenu =men;
      for (let i=0;i<this.model.length;i++){
        this.values.push(new Quantity());
        this.values[i].quantity=0;
      }
    });
  }

  getProducts():void{
    this.menuService.getItems().subscribe((men: any[]) => {
      this.model = men;
      for (let i=0;i<this.model.length;i++){
        this.values.push(new Quantity());
        this.values[i].quantity=0;
      }
    });
  }

  search():void{
    var newmenu=[];
    for (let i=0;i<this.model.length;i++){
     if(this.searchKey===(this.model[i].item )){
       newmenu.push(this.model[i]);
    }else{

    }
  }
  this.model.pop();
  this.model=newmenu;
  if(newmenu.length==0){
    alert("No items found");
this.getProducts();
  }
  }

  beverage():void{
    var newmenu=[];

    for (let i=0;i<this.oldMenu.length;i++){
      if(2===(this.oldMenu[i].type )){
        newmenu.push(this.oldMenu[i]);
     }else{
 
     }
   }
   this.model=newmenu;
   if(newmenu.length==0){
    alert("No items found");
this.getProducts();
  }
  }

  snacks():void{
    var newmenu=[];
    for (let i=0;i<this.oldMenu.length;i++){
      if(1===(this.oldMenu[i].type )){
        newmenu.push(this.oldMenu[i]);
     }else{
     }
   }
   this.model=newmenu;
   if(newmenu.length==0){
    alert("No items found");
this.getProducts();
  }
  }

  gotoPay(){
    this.router.navigate(['/checkout', { amount: this.totalAmount }]);

  }

addTocart():void{
  console.log(this.values);
    let url = "http://localhost:8080/addToCart";
    this.modalCart.quantity1=this.values[0].quantity;
    this.modalCart.quantity2=this.values[1].quantity;
    this.modalCart.quantity3=this.values[2].quantity;
    var modelnew=[];
    var totalcart=0;
    var amount=0;
    for (var i=0;i<=this.values.length;i++){
      if(this.values.length!==i){
       var g=0;
      if(this.values[i].quantity>0){
        totalcart=totalcart+this.values[i].quantity;
        g=-Math.abs(this.values[i].quantity); 
amount = amount+this.model[i].price;
this.values[i].quantity=g;
       console.log(this.values[i].quantity);
        modelnew[i]=this.values[i];
      }else{
        modelnew[i]=this.values[i];
      }
    }else{
      break;
    }
  }
  this.totalAmount = amount;
this.total=totalcart;
    console.log(modelnew);
    this.http.post<number>(url,modelnew).subscribe(
      res=>{
        this.ngOnInit();
      },
      err=>{
        alert("Error adding items to cart");
      }
    )

  }


  


}

export interface menu {
  id:string;
  item:string;
  price:number;
  type:number;
  quantity:number;
  url:string;
  formID:string;
  cartID:string;
}

export interface cart {
  quantity1:number;
  quantity2:number;
  quantity3:number;
}

export class Quantity {
  quantity:number;
}
