// import faker from '/utilities/db/fakeData.js';

var app = angular.module("myApp", ["ngRoute"]);

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

app.controller("rootCtrl", function ($scope, $rootScope, $http) {
  $rootScope.db = [];
  $rootScope.user = [];
  // var getAll = $http.get("/utilities/db/db.json").then((response) => {
  //   $rootScope.db = response.data;
  //   // console.log($rootScope.db);
  // });

  //search
  $scope.txtSearch = "";
  $scope.search = function () {
    $scope.txtSearch = document.getElementById("txtSearch").value;
    // console.log($scope.txtSearch);
  };
});

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "/views/pages/Home.html?" + Math.random(),
      controller: "homeCtrl",
    })
    .when("/products/:idCategory", {
      templateUrl: "/views/pages/Products.html?" + Math.random(),
      controller: "productsCtrl",
    })
    .when("/shoppingcart", {
      templateUrl: "/views/pages/ShoppingCart.html?" + Math.random(),
      controller: "ShoppingCartCtrl",
    })
    .when("/detail/:id", {
      templateUrl: "/views/pages/DetailProduct.html?" + Math.random(),
      controller: "detailCtrl",
    })
    .when("/about", {
      templateUrl: "/views/pages/About.html?" + Math.random(),
    })
    .when("/account/login", {
      templateUrl: "/views/pages/Login.html?" + Math.random(),
      controller: "loginCtrl",
    })
    .when("/account/register", {
      templateUrl: "/views/pages/Register.html?" + Math.random(),
      controller: "registerCtrl",
    })
    .when("/account/changepassword", {
      templateUrl: "/views/pages/FogotPass.html?" + Math.random(),
      controller: "fogotPassword",
    })
    .when("/manager", {
      templateUrl: "/views/pages/ProductManager.html?" + Math.random(),
      controller: "managerCtrl",
    })
    .otherwise({
      redirectTo: "/",
    });
});

//Home
app.controller("homeCtrl", function ($scope, $rootScope, $http, $timeout) {
  $scope.products = [];
  $http
    .get("http://localhost:3000/products?_embed=images")
    .then(function (response) {
      $scope.products = response.data;
      // console.log($scope.products);
      // console.log($scope.products[0].image[0].url);
    });
  $scope.initCarousel = function () {
    $(document).ready(function () {
      $(".owl-carousel").owlCarousel({
        center: true,
        autoplay: true,
        autoplayTimeout: 3000,
        loop: true,
        margin: 10,
        nav: false,
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 2,
          },
          1000: {
            items: 4,
          },
        },
      });
    });
  };
  $(document).ready(function () {
    $(".owl-carousel").owlCarousel({
      center: true,
      autoplay: true,
      autoplayTimeout: 3000,
      loop: true,
      margin: 10,
      nav: false,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 4,
        },
      },
    });
  });
});
//Detail
app.controller(
  "detailCtrl",
  function ($scope, $rootScope, $routeParams, $http) {
    //mua sản phẩm đang chọn
    $scope.quantity = 1;
    $scope.buy = () => {
      // kiểm tra user
      if ($rootScope.user.length == 0) {
        alert("Vui lòng đăng nhập !!");
        return;
      }
      var oder = {
        id: uuid(),
        date: Date.now(),
        status: 0,
        totalPrice: $scope.quantity * $scope.product.price,
      };
      var oderDetail = {
        id: uuid(),
        productId: $routeParams.id,
        quantity: $scope.quantity,
        oderId: $rootScope.user.id,
      };

      $http.post("http://localhost:3000/oders/", oder).then((response) => {
        //thêm vào bảng oder detail
        $http
          .post("http://localhost:3000/oderDetails/", oderDetail)
          .then((response) => {
            alert("Mua hàng thành công");
          });
      });
    };
    //add to shoppingCart
    $scope.addShopCart = () => {
      // kiểm tra user
      if ($rootScope.user.length == 0) {
        alert("Vui lòng đăng nhập !!");
        return;
      }
      //kiểm tra trùng sản phẩm
      var existProduct = {};
      $http
        .get(
          "http://localhost:3000/shoppingCarts?userId=" +
          $rootScope.user.id +
          "&productId=" +
          $routeParams.id
        )
        .then((response) => {
          existProduct = response.data;
          //chưa tồn tại => tạo mới
          if (Object.keys(existProduct).length === 0) {
            var newRecord = {
              id: uuid(),
              quantity: 1,
              userId: $rootScope.user.id,
              productId: $routeParams.id,
            };
            console.log("Chưa tồn tại");
            $http
              .post("http://localhost:3000/shoppingCarts/", newRecord)
              .then();
            // tồn tại =>> cộng số lượng
            $rootScope.numProduct++;
          } else {
            alert("Sản phẩm đã tồn tại trong giỏ hàng.");
            return;
          }
        });
    };
    $http
      .get(
        "http://localhost:3000/products/" + $routeParams.id + "?_embed=images"
      )
      .then((response) => {
        $scope.product = response.data;
        // console.log($scope.product);
        // console.log($scope.product.image[0].url);
      });
    $http
      .get("http://localhost:3000/products?_embed=images")
      .then(function (response) {
        $scope.products = response.data;
      });
    $(document).ready(function () {
      $(".owl-carousel").owlCarousel({
        center: true,
        loop: true,
        margin: 10,
        nav: false,
        responsive: {
          0: {
            items: 1,
          },
        },
      });
    });
  }
);

//login
app.controller("loginCtrl", function ($scope, $rootScope, $http, $window) {
  //lấy dữ liệu
  $http.get("http://localhost:3000/users").then((respone) => {
    $scope.users = respone.data;
  });
  //Đăng nhập
  $scope.login = () => {
    var check = false;
    $scope.users.forEach((i) => {
      if ($scope.user.email == i.email && $scope.user.password == i.password) {
        $rootScope.user = angular.copy(i);
        // console.log($rootScope.user);
        check = true;
      }
    });
    if (check) {
      alert("Đăng nhập thành công");
      $window.location.href = "#!/";
      //số lượng sản phẩm trong giỏ hàng
      $http
        .get(
          "http://localhost:3000/shoppingCarts?_expand=product&userId=" +
          $rootScope.user.id
        )
        .then((response) => {
          $scope.productCart = angular.copy(response.data);
          // console.log($scope.productCart);
          //lấy số sản phẩm
          $rootScope.numProduct = $scope.productCart.length;
        });
    } else {
      alert("Tài khoản hoặc mật khẩu không chính xác");
    }
  };
  //đăng xuất
  $scope.logout = () => {
    location.reload(true);
    // $window.location.href = "#!/";
  };
});
// register
app.controller(
  "registerCtrl",
  function ($scope, $rootScope, $http, $window, $timeout) {
    // $scope.fullName = "";
    // $scope.PhoneNumber = "";
    // $scope.email = "";
    // $scope.password = "";
    // $scope.address = "";

    $scope.register = () => {
      const user = {
        id: uuid(),
        fullName: $scope.fullName,
        PhoneNumber: $scope.phoneNumber,
        email: $scope.email,
        password: $scope.password,
        address: $scope.address,
        position: "0",
      };
      console.log(user);
      if (user.fullName === undefined) {
        alert("Họ tên không hợp  lệ");
        return;
      }
      if (user.email === undefined) {
        alert("Email không hợp  lệ");
        return;
      }
      if (user.PhoneNumber === undefined) {
        alert("Số điện thoại không hợp  lệ");
        return;
      }

      if (user.password === undefined) {
        alert("Mật khẩu không hợp  lệ");
        return;
      }
      if (user.address === undefined) {
        alert("Địa chỉ không hợp  lệ");
        return;
      }
      if (user.address === undefined) {
        alert("Địa chỉ không hợp  lệ");
        return;
      } else {
        //kiểm tra tài khoản tồn tại chưa
        $http
          .get("http://localhost:3000/users?email=" + user.email)
          .then((response) => {
            if (response.data.length > 0) {
              alert("Tài khoản đã tồn tại");
              return;
            } else {
              $http
                .post("http://localhost:3000/users", user)
                .then((respone) => {
                  $scope.users = respone.data;
                  $rootScope.user = user;
                  $window.location.href = "#!/";
                  // console.log($rootScope.user);
                  alert("Tạo tài khoản thành công. Vui lòng đăng nhập lại!!!");
                });
            }
          });
      }
    };
  }
);

//fogot password
app.controller("fogotPassword", function ($scope, $rootScope, $http, $window) {
  $scope.fogot = () => {
    var check = false;
    $rootScope.db.user.forEach((i) => {
      if ($scope.email == i.email) {
        alert("Password của bạn là: " + i.password);
        check = true;
      }
    });
    if (!check) {
      alert("Email không hợp lệ !");
    }
  };
});

//tất cả sản phẩm
app.controller(
  "productsCtrl",
  function ($scope, $routeParams, $rootScope, $http, $window) {
    // $scope.page = 0;
    // $scope.products = [];
    // nếu = 0 thì lấy all
    if ($routeParams.idCategory == 0) {
      $scope.idCategory = "";
    } else {
      $scope.idCategory = "&categoryId=" + $routeParams.idCategory;
    }
    $http
      .get("http://localhost:3000/products?_embed=images" + $scope.idCategory)
      .then((response) => {
        $scope.products = response.data;
        $scope.page = new Array(parseInt($scope.products.length / 12) + 1);
        console.log($scope.page);
      });

    $http.get("http://localhost:3000/categories").then((response) => {
      $scope.categories = response.data;
      // console.log($scope.categories);
    });
    //Phân trang
    $scope.begin = 0;
    $scope.numPage = (index) => {
      $scope.begin = index * 12;
      // console.log($scope.begin);
    };

    //OderBy
    $scope.status = "";
    $scope.oderBy = function () {
      // $scope.status = document.getElementById('status').value;
      console.log(document.getElementById("status").value);
    };
  }
);

//ShoppingCart

app.controller(
  "ShoppingCartCtrl",
  function ($scope, $rootScope, $http, $window, $timeout) {
    $scope.productCart = [];
    $scope.totalPrice = 0;

    if ($rootScope.user.length == 0) {
      console.log("emty");
    } else {
      $http
        .get(
          "http://localhost:3000/shoppingCarts?_expand=product&userId=" +
          $rootScope.user.id
        )
        .then((response) => {
          $scope.productCart = angular.copy(response.data);
          // console.log($scope.productCart);
          //lấy số sản phẩm
          $rootScope.numProduct = $scope.productCart.length;
          // tính tổng tiền
          $scope.productCart.forEach((p) => {
            $scope.totalPrice += p.quantity * p.product.price;
            // console.log(p.quantity);
            // console.log(p.product.price);
          });
        });
      $scope.productCart.forEach((p) => {
        $scope.totalPrice += p.quantity * p.product.price;
        // console.log(p.quantity);
        // console.log(p.product.price);
      });
    }
    //change quantity
    $scope.changeQuantity = (index) => {
      var record = $scope.productCart[index];

      var newRecord = {
        id: record.id,
        quantity: record.quantity,
        userId: record.userId,
        productId: record.productId,
      };
      $http
        .put("http://localhost:3000/shoppingCarts/" + record.id, newRecord)
        .then((response) => {
          $http
            .get(
              "http://localhost:3000/shoppingCarts?_expand=product&userId=" +
              $rootScope.user.id
            )
            .then((response) => {
              $scope.productCart = angular.copy(response.data);
              // console.log($scope.productCart);
              //lấy số sản phẩm
              $rootScope.numProduct = $scope.productCart.length;
              $scope.totalPrice = 0;
              $scope.productCart.forEach((p) => {
                $scope.totalPrice += p.quantity * p.product.price;
                // console.log(p.quantity);
                // console.log(p.product.price);
              });
            });
        });
    };
    //xóa khỏi giỏ hàng
    $scope.deleteCart = (index) => {
      var newRecord = $scope.productCart[index];
      $http
        .delete("http://localhost:3000/shoppingCarts/" + newRecord.id)
        .then((response) => {
          $http
            .get(
              "http://localhost:3000/shoppingCarts?_expand=product&userId=" +
              $rootScope.user.id
            )
            .then((response) => {
              $scope.productCart = angular.copy(response.data);
              // console.log($scope.productCart);
              //lấy số sản phẩm trong giỏ hàng
              $rootScope.numProduct = $scope.productCart.length;
              $scope.totalPrice = 0;
              $scope.productCart.forEach((p) => {
                $scope.totalPrice += p.quantity * p.product.price;
                // console.log(p.quantity);
                // console.log(p.product.price);
              });
            });
        });
    };
    // Thanh thoán
    $scope.pay = () => {
      var oder = {
        id: uuid(),
        date: Date.now(),
        status: 0,
        totalPrice: $scope.totalPrice,
      };
      var oderDetail = [];
      $scope.productCart.forEach((p) => {
        oderDetail.push({
          id: p.id,
          productId: p.productId,
          quantity: p.quantity,
          oderId: oder.id,
        });
      });
      // console.log(oder);
      // console.log(oderDetail);

      //thêm vào bảng oder
      $http.post("http://localhost:3000/oders/", oder).then((response) => { });
      //thêm vào bảng oder detail
      oderDetail.forEach((o) => {
        $http
          .post("http://localhost:3000/oderDetails/", o)
          .then((response) => { });
        $timeout(() => {
          $http
            .delete("http://localhost:3000/shoppingCarts/" + o.id)
            .then((response) => {
              $http
                .get(
                  "http://localhost:3000/shoppingCarts?_expand=product&userId=" +
                  $rootScope.user.id
                )
                .then((response) => {
                  $scope.productCart = angular.copy(response.data);
                  // console.log($scope.productCart);

                  //lấy số sản phẩm trong giỏ hàng
                  $rootScope.numProduct = $scope.productCart.length;
                  $scope.totalPrice = 0;
                  $scope.productCart.forEach((p) => {
                    $scope.totalPrice += p.quantity * p.product.price;
                    // console.log(p.quantity);
                    // console.log(p.product.price);
                  });
                });
            });
        }, 5);
      });

      alert("Mua hàng thành công");
    };
  }
);

//manager Ctrl
app.controller(
  "managerCtrl",
  function ($scope, $rootScope, $http, $window, $timeout) {
    //danh sách categories
    $scope.categories = [];
    $http.get("http://localhost:3000/categories").then((response) => {
      $scope.categories = response.data;
      // console.log($scope.categories);
    });
    //danh sách sản phẩm
    $scope.products = [];
    $http
      .get("http://localhost:3000/products?_embed=images&_expand=category")
      .then((response) => {
        $scope.products = response.data;
        console.log($scope.products);
      });

    //Product

    $scope.product = {
      id: "",
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      images: [
        {
          id: "",
          url: "",
          productId: "",
        },
        {
          id: "",
          url: "",
          productId: "",
        },
        {
          id: "",
          url: "",
          productId: "",
        },
      ],
    };
    $scope.indexProduct = -1;
    $scope.editProduct = (index) => {
      $scope.indexProduct = index;
      // $scope.product = $scope.products[index];
      $scope.product = {
        id: $scope.products[index].id,
        name: $scope.products[index].name,
        description: $scope.products[index].description,
        price: $scope.products[index].price,
        categoryId: $scope.products[index].categoryId,
        images: $scope.products[index].images,
      };

      // $scope.products[index].images.forEach((i) => {
      //   $scope.product.images.push(i.url);
      // });
    };

    $scope.addProduct = () => {
      var product = {
        id: uuid(),
        name: $scope.product.name,
        description: $scope.product.description,
        price: $scope.product.price,
        categoryId: $scope.product.categoryId,
      };
      var images = [
        {
          id: uuid(),
          url: $scope.product.images[0].url,
          productId: product.id,
        },
        {
          id: uuid(),
          url: $scope.product.images[1].url,
          productId: product.id,
        },
        {
          id: uuid(),
          url: $scope.product.images[2].url,
          productId: product.id,
        },
      ];
      //validate product
      if ($scope.product.name === undefined || $scope.product.name === "") {
        alert("Tên sản phẩm không hợp lệ");
        return;
      }
      if ($scope.product.price === undefined || $scope.product.price === "") {
        alert("Giá sản phẩm không hợp lệ");
        return;
      } else {
        //thêm sản phẩm trước
        $http.post("http://localhost:3000/products/", product)
          .then(function (response) {
            //thêm hình ảnh
            for (let i = 0; i < images.length; i++) {
              if (images[i].url !== undefined || images[i].url !== "") {
                $http.post("http://localhost:3000/images/", images[i]).then(function (response) { });
              }
              if (i == images.length - 1) {
                //getAll
                $http
                  .get(
                    "http://localhost:3000/products?_embed=images&_expand=category"
                  )
                  .then((response) => {
                    $scope.products = response.data;
                    console.log($scope.products);
                  });
                // $scope.newProduct();
              }
            }
          }).then(function (response) {
            $scope.newProduct();
          });
      }
    };

    $scope.deleteProduct = () => {
      var idProduct = $scope.product.id;
      var images = $scope.product.images;
      $http.delete('http://localhost:3000/products/' + idProduct).then((response) => {

        $http.delete('http://localhost:3000/images?productId=' + idProduct).then(function (response) {
          console.log("Xóa ảnh thành công")
        })
      }).then(function (response) {
        //getAll
        $http
          .get(
            "http://localhost:3000/products?_embed=images&_expand=category"
          )
          .then((response) => {
            $scope.products = response.data;
            console.log($scope.products);
          });
        // $scope.newProduct();
      });

    };

    $scope.updateProduct = () => {
      var id = $scope.product.id;
      var product = {
        id: $scope.product.id,
        name: $scope.product.name,
        description: $scope.product.description,
        price: $scope.product.price,
        categoryId: $scope.product.categoryId,
      };
      var images = [$scope.product.images[0], $scope.product.images[1], $scope.product.images[2]];

      //validate product
      if (product.name === undefined || product.name === "") {
        alert("Tên sản phẩm không hợp lệ");
        return;
      }

      if (product.price === undefined || product.price === "") {
        alert("Giá sản phẩm không hợp lệ");
        return;
      }
      if (product.categoryId === undefined || product.categoryId === "") {
        alert("Danh mục sản phẩm không hợp lệ");
        return;
      } else {
        // console.log(product);
        // console.log(images);
        //sửa sản phẩm
        $http.put("http://localhost:3000/products/" + id, product)
          .then(function (response) {
            for (let i = 0; i < images.length; i++) {
              if (images[i].url !== undefined || images[i].url !== "") {
                $http.put("http://localhost:3000/images/" + images[i].id, images[i]).then(function (response) {
                  console.log(response.data);
                });
              }
            }
            //getAll
            $http
              .get(
                "http://localhost:3000/products?_embed=images&_expand=category"
              )
              .then((response) => {
                $scope.products = response.data;
                console.log($scope.products);
              });
          });
      }
    };

    $scope.newProduct = () => {
      $scope.product = {
        id: "",
        name: "",
        description: "",
        price: 0,
        categoryId: "b23cfe71-3a80-4ac6-b1b9-a55ade2fb1c2",
        images: [
          {
            id: "",
            url: "",
            productId: "",
          },
          {
            id: "",
            url: "",
            productId: "",
          },
          {
            id: "",
            url: "",
            productId: "",
          },
        ],
      };
      $scope.indexProduct = -1;
    };

    //Category
    $scope.category = {};
    $scope.indexCategory = -1;
    $scope.editCategory = (index) => {
      $scope.indexCategory = index;
      $scope.category = $scope.categories[index];
    };
    $scope.addCategory = () => {
      var category = {
        id: uuid(),
        name: $scope.category.name,
      };
      if (category.name === undefined || category.name === "") {
        alert("Tên không hợp lệ");
        return;
      } else {
        $http
          .post("http://localhost:3000/categories/", category)
          .then((response) => {
            alert("Thêm Danh mục thành công");
            $http.get("http://localhost:3000/categories").then((response) => {
              $scope.categories = response.data;
              // console.log($scope.categories);
            });
            $scope.indexCategory = -1;
            $scope.category = {};
          });
      }
    };

    $scope.deleteCategory = () => {
      var category = $scope.category;
      $http
        .delete("http://localhost:3000/categories/" + category.id)
        .then((response) => {
          alert("Xóa Danh mục thành công");
          $http.get("http://localhost:3000/categories").then((response) => {
            $scope.categories = response.data;
            // console.log($scope.categories);
            $scope.indexCategory = -1;
            $scope.category = {};
          });
        });
    };
    $scope.updateCategory = () => {
      var category = $scope.category;
      category.name = $scope.category.name;
      $http
        .put("http://localhost:3000/categories/" + category.id, category)
        .then((response) => {
          alert("Sửa Danh mục thành công");
          $http.get("http://localhost:3000/categories").then((response) => {
            $scope.categories = response.data;
            // console.log($scope.categories);
            $scope.indexCategory = -1;
            $scope.category = {};
          });
        });
    };
    $scope.newCategory = () => {
      $scope.indexCategory = -1;
      $scope.category = {};
    };

    //show images when input
    for (let i = 0; i < 3; i++) {
      document
        .getElementById("image" + i)
        .addEventListener("change", function (event) {
          var file = event.target.files[0];
          var reader = new FileReader();

          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.product.images[i].url = file.name;
            });
          };

          reader.readAsDataURL(file);
        });
    }

    //thêm sự kiện
  }
);
