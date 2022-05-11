import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import InputPassword from "./InputPassword";
import Confirmpassword from "./Confirmpassword";
import { useRouter } from "next/router";

const SubmitBtnDiv = styled.div`
	margin-top: 30px;
	width: 100%;
	height: 100px;
	margin-right: 10px;
	display: flex;
	& > button {
		padding: 6px 6px;
		background-color: #ffba34;
		border-radius: 4px;
		border: none;
		color: white;
		cursor: pointer;
		height: 50px;
	}
	.cancel {
		margin-left: auto;
		margin-right: 5px;
	}
	.submit {
	}
`;

function Passwordchange() {
	const router = useRouter();
	const accessToken = sessionStorage.getItem("accessToken");

	const [passwordError, setPasswordErr] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const [passwordInput, setPasswordInput] = useState({
		password: "",
		confirmPassword: "",
	});
	const [changeInfo, setchangeInfo] = useState({
		user_id: "",
		password: "",
	});

	const userInfoHandler = () => {
		if (!accessToken) {
			return;
		} else {
			axios
				.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`, {
					headers: { authorization: `Bearer ${accessToken}` },
					"Content-Type": "application/json",
				})
				.then(res => {
					setchangeInfo(res.data.data.userInfo);
					console.log("개인정보가져오기 성공");
				})
				.catch(err => {
					console.log("개인가져오기 에러", err);
				});
		}
	};
	useEffect(() => {
		userInfoHandler();
	}, []);

	const fixPasswordHandler = () => {
		const { password } = passwordInput;
		if (passwordInput.confirmPassword === "" && passwordInput.password === "") {
			return setPasswordErr("비밀번호를 입력해주세요");
		}
		if (passwordInput.confirmPassword === passwordInput.password) {
			axios
				.patch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/users`,
					{ user_id: changeInfo.user_id, password },
					{
						headers: { authorization: `Bearer ${accessToken}` },
					}
				)
				.then(res => {
					if (changeInfo.password === passwordInput.password) {
						return alert("기존에 사용하는 비밀번호와 같습니다.");
					} else {
						console.log("패스워드 변경 완료", res);
						alert("패스워드가 변경되었습니다.");
						return router.push("/mypage");
					}
				})
				.catch(err => {
					alert("패스워드 변경 에러입니다.");
					console.log("패스워드 패치 오류입니다.", err);
				});
		}
	};

	const handlePasswordChange = e => {
		const passwordInputValue = e.target.value.trim();
		const passwordInputFieldName = e.target.name;
		const NewPasswordInput = {
			...passwordInput,
			[passwordInputFieldName]: passwordInputValue,
		};
		setPasswordInput(NewPasswordInput);
	};
	const handleValidation = e => {
		const passwordInputValue = e.target.value.trim();
		const passwordInputFieldName = e.target.name;
		//for password
		if (passwordInputFieldName === "password") {
			const lowercaseRegExp = /(?=.*?[a-z])/;
			const digitsRegExp = /(?=.*?[0-9])/;
			const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
			const minLengthRegExp = /.{8,}/;
			const lowercasePassword = lowercaseRegExp.test(passwordInputValue);
			const digitsPassword = digitsRegExp.test(passwordInputValue);
			const specialCharPassword = specialCharRegExp.test(passwordInputValue);
			const minLengthPassword = minLengthRegExp.test(passwordInputValue);
			let errMsg = "";
			if (!lowercasePassword) {
				errMsg = "하나 이상의 소문자를 입력해주세요.";
			} else if (!digitsPassword) {
				errMsg = "하나 이상의 숫자를 입력해주세요.";
			} else if (!specialCharPassword) {
				errMsg = "하나 이상의 특수문자를 입력해주세요.";
			} else if (!minLengthPassword) {
				errMsg = "최소 8자 이상의 비밀번호를 입력해주세요.";
			} else {
				errMsg = "";
			}
			setPasswordErr(errMsg);
		}
		// for confirm password
		if (
			passwordInputFieldName === "confirmPassword" ||
			(passwordInputFieldName === "password" &&
				passwordInput.confirmPassword.length > 0)
		) {
			if (passwordInput.confirmPassword !== passwordInput.password) {
				setConfirmPasswordError("비밀번호가 서로 일치하지 않습니다.");
			} else {
				setConfirmPasswordError("");
			}
		}
	};

	return (
		<div>
			{/* <PasswordTitle>비밀번호</PasswordTitle> */}
			<InputPassword
				handlePasswordChange={handlePasswordChange}
				handleValidation={handleValidation}
				passwordValue={passwordInput.password}
				passwordError={passwordError}
			/>
			<Confirmpassword
				handlePasswordChange={handlePasswordChange}
				handleValidation={handleValidation}
				confirmPasswordValue={passwordInput.confirmPassword}
				confirmPasswordError={confirmPasswordError}
			/>
			{/* <SubmitBtnDiv> */}
			<button className="submit" onClick={fixPasswordHandler}>
				수정
			</button>
			{/* </SubmitBtnDiv> */}
		</div>
	);
}
export default Passwordchange;
