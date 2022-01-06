import sql from "../utils/mssql.js";
import couch from "../utils/couchDB.js";

const dbName = "delivery";


export default{
    async getSellerInforByCouchdb(id){
        const mangoQuery = {
            "selector": {
                "_id": {
                    "$eq": id // var id_seller
                }
            }
        }
        const parameters = {};
        // const viewUrl = "_design/product/_view/product-view?include_docs=true";
        const seller = await couch.mango(dbName, mangoQuery, parameters).then(async function (data, headers, status) {
            return await data.data.docs[0]
        }, function(err) {
            console.log(err)
        });
        // console.log(seller)
        return seller;

    },
    async getAllSellerInforByCouchdb(id) {
        // const viewUrl = "_design/product/_view/product-view?include_docs=true";
        const mangoQuery = {
            "selector": {
                "type": {
                    "$eq": "store" // var id_seller
                }
            }
        }
        const parameters = {};

        const seller = await couch.get(dbName, mangoQuery, parameters).then(async function (data, headers, status) {
            return await data.data.docs
        }, function (err) {
            console.log(err)
        });
        // cons
    },
        //--------------------------------------------
    async getBranch(idCompany){
        return sql.connect.request().input('idCompany', sql.mssql.VarChar, idCompany).
        query('SELECT * \n' +
            'FROM ChiNhanh CN JOIN KhuVucHoatDong KVHD ON CN.DiaChi = KVHD.MAKHUVUC');
    },
    async getBranchByID(idCompany){
        return sql.connect.request().input('idCompany', sql.mssql.VarChar, idCompany).
        query('SELECT * FROM ChiNhanh CN JOIN KhuVucHoatDong KVHD ON CN.DiaChi = KVHD.MAKHUVUC WHERE MADOANHNGHIEP = @idCompany');
    },
    async getBranchNullConstract(idCompany){
        return sql.connect.request().input('idCompany', sql.mssql.VarChar, idCompany).
        query('select * from ChiNhanh cn join KhuVucHoatDong kv on kv.MAKHUVUC = cn.DiaChi where cn.MaDoanhNghiep = @idCompany and cn.MaHopDong is null');
    },
    async insertBranch(branch, idUser){
        try{
            return sql.connect.request().input('idBranch', sql.mssql.VarChar(5), branch.name).
            input('idCompany', sql.mssql.VarChar, idUser).
            input('addressBranch',sql.mssql.VarChar, branch.address).
            input('ds', sql.mssql.Money, 0).
            input('idContract', sql.mssql.VarChar, null).
            query('EXEC INSERT_CHINHANH @idBranch, @idCompany, @addressBranch, @ds, @idContract');
        }catch(e){
            console.log(e)
            return false;
        }
    },
    async insertNewBranchToContract(idBranch, idUser, idContract){
        try{
            return sql.connect.request().input('idBranch', sql.mssql.VarChar(5), idBranch).
            input('idCompany', sql.mssql.VarChar, idUser).
            input('idContract', sql.mssql.VarChar, idContract).
            query('EXEC insertNewBranchToContract @idBranch, @idCompany, @idContract');
        }catch(e){
            console.log(e)
            return false;
        }
    },
    async deleteBranch(idBranch, idCompany){
        try{
            return sql.connect.request().input('idBranch', sql.mssql.VarChar(5), idBranch).
            input('idCompany', sql.mssql.VarChar, idCompany).
            query('EXEC DELETE_CHINHANH @idBranch, @idCompany');
        }catch(e){
            console.log(e)
            return false;
        }
    },
    async updateBranch(idBranch, idCompany, address){
        try{
            return sql.connect.request().input('idBranch', sql.mssql.VarChar(5), idBranch).
            input('idCompany', sql.mssql.VarChar, idCompany).
            input('addressBranch',sql.mssql.VarChar, address).
            query('UPDATE ChiNhanh Set diachi=@addressBranch where MACHINHANH = @idBranch and MaDoanhNghiep = @idCompany');
        }catch(e){
            console.log(e)
            return false;
        }
    },
    async getActivityZone(){
        try{
            return sql.connect.request().
            query('SELECT * FROM KHUVUCHOATDONG');
        }catch(e){
            console.log(e)
            return false;
        }
    },
    async insertContract(idContract, idCompany,ngdaidien, sochinhanhdk, date, time){
        try{
            return sql.connect.request().input('idContract', sql.mssql.VarChar(5), idContract).
            input('idCompany', sql.mssql.VarChar, idCompany).
            input('ngdaidien',sql.mssql.VarChar, ngdaidien).
            input('sochinhanhdk', sql.mssql.Int, sochinhanhdk).
            input('date', sql.mssql.Date, date).
            input('time', sql.mssql.Int, time).
            query('EXEC INSERT_HopDong @idContract, @ngdaidien, @sochinhanhdk, @time, 0.1,@date, @idCompany ');
        }catch(e){
            console.log(e)
            return false;
        }
    },
    async getContract(idCompany){
        return sql.connect.request().input('idCompany', sql.mssql.VarChar, idCompany).
        query('select cn.* from HopDong cn where cn.MaDoanhNghiep = @idCompany');
    },
    async getAllContractID(idCompany){
        return sql.connect.request().
        query('select cn.* from HopDong cn');
    },
    async getBranchWithIDContract(idContract){
        const rawData =await sql.connect.request()
                             .input('idContract', sql.mssql.VarChar, idContract)
                             .query('SELECT MACHINHANH as MaChiNhanh, DiaChi\n' +
                             '             FROM ChiNhanh\n' +
                             '             WHERE MAHOPDONG=@idContract ')
        const branchList = rawData.recordset;
        // const branchList = [
        //     {
        //         MaChiNhanh : '1',
        //         DiaChi : 'Bình Phước, Lộc Ninh'
        //     },
        //     {
        //         MaChiNhanh : '2',
        //         DiaChi : 'Quảng Nam'
        //     },
        //     {
        //         MaChiNhanh : '3',
        //         DiaChi : 'Quảng Trị'
        //     },
        //     {
        //         MaChiNhanh : '4',
        //         DiaChi : 'Thành Phố Hồ Chí Minh'
        //     },
        //     {
        //         MaChiNhanh : '5',
        //         DiaChi : 'Huế'
        //     }
        // ];
        return branchList;
    },
    async getAllContract(){
        const rawData =  await sql.connect.request()
             .query('exec viewAllContract');

        const contractData = rawData.recordset;
        // const contractData = [
        //     {
        //         MaHD : '1',
        //         TenDoanhNghiep : 'FPT',
        //         NgayBatDau: new Date(2021, 10, 27),
        //         HieuLuc : 6,
        //     },
        //     {
        //         MaHD : '2',
        //         TenDoanhNghiep : 'Apple',
        //         NgayBatDau: new Date(2021, 8, 27),
        //         HieuLuc : 3,
        //         DangGiaHan : true
        //     },
        //     {
        //         MaHD : '3',
        //         TenDoanhNghiep : 'Microsoft',
        //         NgayBatDau: new Date(2021, 5, 27),
        //         HieuLuc : 3,
        //     }
        // ];
        return contractData;
    },
    async getContractWithID(idContract){
        const rawData = await sql.connect.request()
                             .input('idContract', sql.mssql.VarChar, idContract)
                             .query('SELECT MAHD, TenDoanhNghiep, HD.NguoiDaiDien, NgayBatDau, HieuLuc, SoChiNhanhDK\n' +
                                 '             FROM HopDong HD JOIN DoanhNghiep DN ON HD.MaDoanhNghiep = DN.MaSoThue\n' +
                                 '             WHERE MaHD=@idContract');
        const contractData = rawData.recordset[0];
        // const contractData = {
        //     MaHD : '1',
        //     TenDoanhNghiep : 'FPT',
        //     NguoiDaiDien : 'Nguyễn Văn A',
        //     NgayBatDau: '27/05/2021',
        //     HieuLuc : 3,
        //     SoChiNhanhDK : 3
        // };
        return contractData
    },
    async updateBranch_Contract(idBranch, idCompany, idContract){
        try{
            if((typeof idBranch) === "string"){
                sql.connect.request().input('idBranch', sql.mssql.VarChar(5), idBranch).
                input('idCompany', sql.mssql.VarChar, idCompany).
                input('idContract',sql.mssql.VarChar, idContract).
                query('UPDATE ChiNhanh Set MaHopDong=@idContract where MACHINHANH = @idBranch and MaDoanhNghiep = @idCompany');
            }
            else{
                idBranch.forEach(function (e){
                    sql.connect.request().input('idBranch', sql.mssql.VarChar(5), e).
                    input('idCompany', sql.mssql.VarChar, idCompany).
                    input('idContract',sql.mssql.VarChar, idContract).
                    query('UPDATE ChiNhanh Set MaHopDong=@idContract where MACHINHANH = @idBranch and MaDoanhNghiep = @idCompany');
                })
            }
        }catch(e){
            console.log(e)
            return false;
        }
    },
    increaBranchID(arr){
        if(Object.keys(arr).length === 0 || arr === null)
            return '0'

        for(var i = 0; i < 100; i++){
            var check = 0;
            arr.forEach(function (e){
                if(e.MACHINHANH === (i.toString()))
                    check = 1;
            })
            if(check === 0)
                return i.toString()
        }
    },
    increaContractID(arr){
        if(Object.keys(arr).length === 0 || arr === null)
            return '0'

        for(var i = 0; i < 100; i++){
            var check = 0;
            arr.forEach(function (e){
                if(e.MaHD === (i.toString()))
                    check = 1;
            })
            if(check === 0)
                return i.toString()
        }
    },

    async updateDangGiaHanContract(idContract) {
        sql.connect.request()
            .input('idContract', sql.mssql.VarChar, idContract)
            .input('DangGiaHan', sql.mssql.BIT, false)
            .query('UPDATE HopDong Set DangGiaHan=@DangGiaHan where MaHD = @idContract');
    },
    async getOrderByID(idCompany){
        const mangoQuery = {
            selector: {
                "_id" : {
                    $eq : idCompany
                }
            }
        };
        const parameters = {};

        return couch.mango(dbName, mangoQuery, parameters)
    },
    async getOrderByOrderID(idCompany){
        return sql.connect.request().input('idCompany', sql.mssql.VarChar, idCompany).
        query('SELECT * FROM DonHang dh join taixe tx on tx.matx = dh.matx  join khachhang kh on dh.makh = kh.makh WHERE dh.MaDH = @idCompany');
    },
    async getProductDetailByOrderID(idCompany) {
        return sql.connect.request().input('idCompany', sql.mssql.VarChar, idCompany).
        query('SELECT * FROM DonHang dh join DonHang_SP dhsp on dh.madh = dhsp.madh  join SANPHAM sp on sp.masp = dhsp.masp WHERE dh.MaDH = @idCompany');

    },
    getProductByComID(idCompany) {
        const mangoQuery = {
            selector: {
                "_id": {
                    "$eq": idCompany
                }
            }
        };

        const parameters = {};
        return couch.mango(dbName, mangoQuery, parameters);
    }
}