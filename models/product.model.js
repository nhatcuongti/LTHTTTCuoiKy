import sql from "../utils/mssql.js";
import knexObj from '../utils/knex.js'
import accountModel from "./account.model.js";
import formatData from "../utils/formatData.js";
import couch from "../utils/couchDB.js";

const dbName = 'delivery';

export default{
    async getNameProductWithID(idProduct){
        // const products = [
        //     {
        //         idProduct : '1',
        //         idCompany : '1',
        //         name : 'Khẩu Trang',
        //         price : 20000
        //     },
        //     {
        //         idProduct : '2',
        //         idCompany : '2',
        //         name : 'Bánh mì Sandwidth',
        //         price : 10000
        //     },
        //     {
        //         idProduct : '3',
        //         idCompany : '2',
        //         name : 'Xe đạp',
        //         price : 1000000
        //     },
        //     {
        //         idProduct : '4',
        //         idCompany : '1',
        //         name : 'Iphone 13',
        //         price : 20000000
        //     }
        // ]
        const viewURL = '_design/store/_view/view-product-id-store';
        const key = idProduct;
        const queryOptions = {
            key
        };

        return couch.get(dbName, viewURL, queryOptions);
    },
    async insertTypeProduct(typeProduct) {
        const rawData = await accountModel.getTypeProduct();
        const typeProductList = rawData.recordset;

        const idTypeProduct = formatData.increaseTypeProductID(typeProductList);
        return sql.connect.request()
            .input('idTypeProduct', sql.mssql.VarChar, idTypeProduct)
            .input('typeProduct', sql.mssql.NVarChar, typeProduct)
            .query('INSERT INTO LOAIHANG VALUES(@idTypeProduct, @typeProduct)');
    },
    async insertPlace(place) {
        const rawData = await accountModel.getActivePlace();
        const places = rawData.recordset;

        const idPlace = formatData.increaseActivePlace(places);
        return  sql.connect.request()
            .input('idPlace', sql.mssql.VarChar, idPlace)
            .input('place', sql.mssql.NVarChar, place)
            .query('INSERT INTO KhuVucHoatDong VALUES(@idPlace, @place)');
    }
}