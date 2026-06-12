package org.acme.login;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.multipart.FileUpload;
import io.vertx.ext.web.RoutingContext;
import java.net.URI;
import java.io.InputStream;
import java.util.Map;
import java.util.UUID;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

@Path("/") 
public class AuthResource {

    @Inject
    RoutingContext context;

    @GET
    @Path("/login") 
    @Produces(MediaType.TEXT_HTML) 
    public Response loginPage() {
        return Response.ok(getClass().getClassLoader().getResourceAsStream("META-INF/resources/login/login.html")).build();
    }

    @POST 
    @Path("/login_check")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response loginCheck(@FormParam("username") String username, @FormParam("password") String password) {
        User user = User.findByUsername(username);
        if (user == null || !user.password.equals(password)) return Response.seeOther(URI.create("/login?error=1")).build();
        context.session().put("loginUser", username);
        return Response.seeOther(URI.create("/")).build();
    }

    @GET
    @Path("/after_login")
    @Produces(MediaType.TEXT_HTML)
    public Response afterLogin() {
        if (context.session().get("loginUser") == null) return Response.seeOther(URI.create("/login")).build();
        return Response.ok(getClass().getClassLoader().getResourceAsStream("META-INF/resources/login/main_after_login.html")).build();
    }

   @GET
@Path("/logout") // 기존에는로그아웃하면항상메인이동
public Response logout(@QueryParam("next") String next) {  // ← next 파라미터추가
context.session().destroy();
String redirect = (next != null && next.equals("login")) ? "/login" : "/";
return Response
.seeOther(URI.create(redirect))  // ← ?next=login 이면/login으로
.build();
}

    @GET
    @Path("/register")
    @Produces(MediaType.TEXT_HTML)
    public Response registerPage() {
        return Response.ok(getClass().getClassLoader().getResourceAsStream("META-INF/resources/login/register.html")).build();
    }

    @POST
    @Path("/register_check")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response registerCheck(@FormParam("username") String username, @FormParam("password") String password,
                                  @FormParam("email") String email, @FormParam("phone") String phone) {
        if (User.findByUsername(username) != null) return Response.seeOther(URI.create("/register?error=duplicate_username")).build();
        if (User.findByEmail(email) != null) return Response.seeOther(URI.create("/register?error=duplicate_email")).build();

        User newUser = new User();
        newUser.username = username;
        newUser.password = password;
        newUser.email = email;
        newUser.phone = phone;
        newUser.persist();
        return Response.seeOther(URI.create("/register_success")).build();
    }

    @GET
    @Path("/register_success")
    @Produces(MediaType.TEXT_HTML)
    public Response registerSuccess() {
        return Response.ok(getClass().getClassLoader().getResourceAsStream("META-INF/resources/login/register_success.html")).build();
    }

    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response mainPage() {
        String loginUser = context.session().get("loginUser");
        String path = (loginUser != null) ? "META-INF/resources/login/main_after_login.html" : "META-INF/resources/main_index.html";
        return Response.ok(getClass().getClassLoader().getResourceAsStream(path)).build();
    }

    @GET
    @Path("/profile")
    @Produces(MediaType.TEXT_HTML)
    public Response profilePage() {
        if (context.session().get("loginUser") == null) return Response.seeOther(URI.create("/login")).build();
        return Response.ok(getClass().getClassLoader().getResourceAsStream("META-INF/resources/login/profile.html")).build();
    }

    @GET
    @Path("/profile/info")
    @Produces(MediaType.APPLICATION_JSON)
    public Response profileInfo() {
        String loginUser = context.session().get("loginUser");
        if (loginUser == null) return Response.status(401).build();

        User user = User.findByUsername(loginUser);
        return Response.ok(Map.of(
            "username", user.username,
            "email", user.email != null ? user.email : "",
            "phone", user.phone != null ? user.phone : "",
            "profileImage", user.profileImage != null ? user.profileImage : ""
        )).build();
    }

    @POST
    @Path("/profile/upload")
    @Transactional
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response profileUpload(@FormParam("profileImage") FileUpload file) {
        String loginUser = context.session().get("loginUser");
        if (loginUser == null) return Response.seeOther(URI.create("/login")).build();

        try {
            String original = file.fileName();
            String ext = original.substring(original.lastIndexOf('.') + 1).toLowerCase();
            
            // 확장자 검사
            if (!ext.matches("jpg|jpeg|png|gif|webp")) {
                return Response.seeOther(URI.create("/profile?error=invalid_type")).build();
            }

            // 파일 크기 검사 (5MB)
            if (file.size() > 5 * 1024 * 1024) {
                return Response.seeOther(URI.create("/profile?error=too_large")).build();
            }

            // 파일 저장
            String newFileName = UUID.randomUUID().toString() + "." + ext;
            java.nio.file.Path uploadDir = Paths.get("src/main/resources/META-INF/resources/uploads/profile");
            Files.createDirectories(uploadDir);
            Files.copy(file.uploadedFile(), uploadDir.resolve(newFileName), StandardCopyOption.REPLACE_EXISTING);

            // DB 업데이트
            User user = User.findByUsername(loginUser);
            user.profileImage = newFileName;

            return Response.seeOther(URI.create("/profile")).build();
        } catch (Exception e) {
            return Response.seeOther(URI.create("/profile?error=upload_failed")).build();
        }
    }
   // 회원정보 수정 처리
    @POST
    @Path("/profile/update")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response profileUpdate(
            @FormParam("email") String email,
            @FormParam("phone") String phone) {

        // ① 세션 체크
        String loginUser = context.session().get("loginUser");
        if (loginUser == null) {
            return Response
                    .seeOther(URI.create("/login"))
                    .build();
        }

        // ② 이메일 중복 체크 (본인 제외)
        User found = User.findByEmail(email);
        if (found != null && !found.username.equals(loginUser)) {
            return Response
                    .seeOther(URI.create("/profile?error=duplicate_email"))
                    .build();
        }

        // ③ DB 업데이트
        User user = User.findByUsername(loginUser);
        user.email = email;
        user.phone = phone;

        return Response
                .seeOther(URI.create("/profile?success=updated"))
                .build();
    }

    // 비밀번호 변경 처리
    @POST
    @Path("/profile/password")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response profilePassword(
            @FormParam("currentPassword") String currentPassword,
            @FormParam("newPassword") String newPassword) {

        // ① 세션 체크
        String loginUser = context.session().get("loginUser");
        if (loginUser == null) {
            return Response
                    .seeOther(URI.create("/login"))
                    .build();
        }

        // ② 현재 비밀번호 확인 (해시값 비교)
        User user = User.findByUsername(loginUser);
        if (!user.password.equals(currentPassword)) {
            return Response
                    .seeOther(URI.create("/profile?error=wrong_password"))
                    .build();
        }

        // ③ 새 비밀번호로 DB 업데이트
        user.password = newPassword;

        return Response
                .seeOther(URI.create("/profile?success=password_changed"))
                .build();
    }

}