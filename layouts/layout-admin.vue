<template>
    <div>
        <nav class="navbar sticky-top navbar-expand-lg navbar-dark" style="background-color: #1877F2;">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Leyeco V - Warehouse</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Purchasing
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><nuxt-link class="dropdown-item" to="/purchasing/canvass">Canvass</nuxt-link></li>
                                <li><a class="dropdown-item" href="#">RV</a></li>
                                <li><a class="dropdown-item" href="#">SPR</a></li>
                                <li><a class="dropdown-item" href="#">JO</a></li>
                                <li><a class="dropdown-item" href="#">MEQS</a></li>
                                <li><a class="dropdown-item" href="#">PO</a></li>
                                <li><a class="dropdown-item" href="#">RR</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Data Mgmt
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><nuxt-link class="dropdown-item" to="/data-management/unit">Unit</nuxt-link></li>
                                <li><a class="dropdown-item" href="#">Item Brand</a></li>
                                <li><a class="dropdown-item" href="#">Vehicle</a></li>
                                <li><a class="dropdown-item" href="#">Supplier</a></li>
                                <li><a class="dropdown-item" href="#">Stock Inventory</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a style="color: #FFFF00;" class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                William Jay
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="#">Profile</a></li>
                                <li><a class="dropdown-item" href="#">Settings</a></li>
                                <li><a class="dropdown-item" href="#">Activity log</a></li>
                                <li><nuxt-link class="dropdown-item" to="/login">Logout</nuxt-link></li>
                            </ul>
                        </li>
                    </ul>
                </div>

            </div>
        </nav>

        <div class="container">

            <div class="mt-5">
                <slot />

            </div>

        </div>

    </div>
</template>