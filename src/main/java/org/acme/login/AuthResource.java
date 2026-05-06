package org.acme.login;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.io.InputStream;

@Path("/") 
public class AuthResource {

    // GET /login → 로그인 HTML 페이지 반환
    @GET
    @Path("/login") 
    @Produces(MediaType.TEXT_HTML) 
    public Response loginPage() {
        InputStream html = getClass()
            .getClassLoader()
            .getResourceAsStream("META-INF/resources/login/login.html");
        return Response.ok(html).build();
    } // <- 기존에 여기서 클래스가 닫혔던 '}'를 메서드 종료로만 사용

    // POST /login_check (이 메서드가 클래스 안으로 들어오도록 위치 수정)
    @POST
    @Path("/login_check")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED) 
    public Response loginCheck(
            @FormParam("username") String username,
            @FormParam("password") String password) {
        // [임시] 일단 로그인 성공 처리
        return Response
            .seeOther(URI.create("/login/main_after_login.html"))
            .build();
    }

} // <- 클래스 전체를 닫는 중괄호는 가장 마지막에 위치해야 합니다.