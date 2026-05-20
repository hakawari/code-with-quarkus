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

    // 4. GET /logout → 로그아웃 처리 및 메인 이동
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

    // 5. GET /register → 회원가입 페이지 연결
    @GET
    @Path("/register")
    @Produces(MediaType.TEXT_HTML)
    public Response registerPage() {
        InputStream html = getClass()
            .getClassLoader()
            .getResourceAsStream("META-INF/resources/login/register.html");
        return Response.ok(html).build();
    }

    // 6. POST /register_check → 가입 데이터 중복 검증 및 DB 저장 실행
    @POST
    @Path("/register_check")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.TEXT_HTML)
    public Response registerCheck(
            @FormParam("username") String username,
            @FormParam("password") String password,
            @FormParam("email")    String email,
            @FormParam("phone")    String phone) {

        // ① 아이디 중복 체크
        if (User.findByUsername(username) != null) {
            return Response
                    .seeOther(URI.create("/register?error=duplicate_username"))
                    .build();
        }

        // ② 이메일 중복 체크
        if (User.findByEmail(email) != null) {
            return Response
                    .seeOther(URI.create("/register?error=duplicate_email"))
                    .build();
        }

        // ③ DB에 신규 유저 정보 삽입
        User newUser = new User();
        newUser.username = username;
        newUser.password = password;
        newUser.email    = email;
        newUser.phone    = phone;
        newUser.persist(); // Hibernate Panache DB 저장

        // ④ 가입 처리 성공 시 완료 페이지로 리다이렉트 이동
        return Response
                .seeOther(URI.create("/register_success"))
                .build();
    }

    // ✨ 7. GET /register_success → 가입 완료 화면(HTML) 반환 엔드포인트 추가
    @GET
    @Path("/register_success")
    @Produces(MediaType.TEXT_HTML)
    public Response registerSuccess() {
        // 아까 맨 아래 'login' 폴더 안에 생성해 둔 register_success.html 파일을 읽어옵니다.
        InputStream html = getClass()
                .getClassLoader()
                .getResourceAsStream("META-INF/resources/login/register_success.html");
        
        return Response.ok(html).build();
    }
}