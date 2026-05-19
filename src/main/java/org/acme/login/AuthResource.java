package org.acme.login;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import io.vertx.ext.web.RoutingContext;
import java.net.URI;
import java.io.InputStream;

@Path("/") 
public class AuthResource {

    @Inject
    RoutingContext context; // Quarkus Vert.x 세션 접근

    // 1. GET /login → 로그인 페이지 반환
    @GET
    @Path("/login") 
    @Produces(MediaType.TEXT_HTML) 
    public Response loginPage() {
        InputStream html = getClass()
            .getClassLoader()
            .getResourceAsStream("META-INF/resources/login/login.html");
        return Response.ok(html).build();
    }

    // 2. POST /login_check → 로그인 데이터 검증 및 세션 생성
    @POST 
    @Path("/login_check")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response loginCheck(
            @FormParam("username") String username,
            @FormParam("password") String password) {
        
        User user = User.findByUsername(username); // 아이디 조회
        
        if (user == null || !user.password.equals(password)) { // 존재 및 비번 확인
            return Response
                    .seeOther(URI.create("/login?error=1"))
                    .build();
        }
        
        // 세션에 로그인 정보 저장
        context.session().put("loginUser", username);
        
        return Response
                .seeOther(URI.create("/after_login"))
                .build();
    }

    // 3. GET /after_login → 로그인 후 메인 페이지 (세션 체크 필수)
    @GET
    @Path("/after_login")
    @Produces(MediaType.TEXT_HTML)
    public Response afterLogin() {
        
        // 세션 체크
        String loginUser = context.session().get("loginUser");

        // 세션 내용 서버 콘솔에 출력
        System.out.println("=== 세션 ID : " + context.session().id());
        System.out.println("=== loginUser : " + loginUser);

        // 세션이 없으면 로그인 페이지로 튕겨내기 (강제 차단)
        if (loginUser == null) {
            return Response
                    .seeOther(URI.create("/login"))
                    .build();
        }

        // 세션이 있으면 정상적으로 메인 HTML 보여주기
        InputStream html = getClass()
                .getClassLoader()
                .getResourceAsStream("META-INF/resources/login/main_after_login.html");
        
        return Response.ok(html).build();
    }

    // 4. [이번 PPT 내용 추가] GET /logout → 로그아웃 처리 및 메인 이동
    @GET
    @Path("/logout")
    public Response logout() {

        // 로그아웃 전 세션 정보 출력
        System.out.println("=== 로그아웃 전 세션 ID : " + context.session().id());
        System.out.println("=== 로그아웃 전 loginUser : " + context.session().get("loginUser"));

        // 세션 전체 삭제 (핵심 로직!)
        context.session().destroy();

        // 로그아웃 후 세션 정보 출력
        System.out.println("=== 로그아웃 후 세션 ID : " + context.session().id());
        System.out.println("=== 로그아웃 후 loginUser : " + context.session().get("loginUser"));

        // 로그아웃 후 메인 경로("/")로 이동
        return Response
                .seeOther(URI.create("/"))
                .build();
    }
} // <- 클래스를 닫는 맨 마지막 중괄호