$(document).ready(function(){
    $("#signup").click(function(){
        let obj={
            type:"get",
            url:"/signup-process",
            data:{
                txtEmail:$("#txtEmail").val(),
                pwd:$("#pwd").val(),
                combo:$("#combo").val()
            }
        }

        $.ajax(obj).done(function(resp){
            $("#msgSign").html(resp);
        }).fail(function(err){
            alert(err.statusText);
        })
    })

    $("#login").click(function(){
        let obj={
            type:"get",
            url:"/login-process",
            data:{
                txtEmaill:$("#txtEmaill").val(),
                txtPwd:$("#txtPwd").val(),
            }
        }
        $.ajax(obj).done(function(resp){
            $("#logspan").html(resp);
        }).fail(function(err){
            alert(err.statusText);
        })
    })
})