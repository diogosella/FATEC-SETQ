import { useState } from 'react';
import SignUp from '../../components/SignUp/index';
import './signupPage.css';
import type { User } from '../../components/SignUp/index';

export default function SignUpPage() {
  const [, setUser] = useState<User | null>(null);

  return (
    <div className="credentialsContainer">
      <SignUp setUser={setUser} />
    </div>
  );
}