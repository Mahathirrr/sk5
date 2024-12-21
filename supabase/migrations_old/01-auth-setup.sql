-- Enable auth schema
create schema if not exists auth;

-- Configure auth settings
alter user authenticator set search_path = public, auth;

-- Configure auth providers
insert into auth.providers (provider) values
    ('google'),
    ('github');

-- Configure auth settings
update auth.config set
    site_url = 'http://localhost:3000',
    additional_redirect_urls = array['http://localhost:3000/auth/callback'],
    mailer_autoconfirm = true,
    sms_autoconfirm = true;
