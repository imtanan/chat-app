class ApiResponse{
    constructor(statusCode,data,message="success"){
        this.statusCode=statusCode, 
                                //this.statusCode creates permanent variable to be accessed outside like const response = new ApiResponse(200, { user: "Alice" });
                                  //console.log(response.statusCode);  Works! This looks at `this.statusCode` (200)
        this.data = data,
        this.message=message,
        this.success = statusCode<400
    }
}
export {ApiResponse}
    