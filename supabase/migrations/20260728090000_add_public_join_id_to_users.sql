create or replace function generate_public_join_id()
returns varchar
language plpgsql
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  generated text;
  index integer;
begin
  loop
    generated := 'bt_';

    for index in 1..6 loop
      generated := generated || substr(
        alphabet,
        floor(random() * length(alphabet) + 1)::integer,
        1
      );
    end loop;

    exit when not exists (
      select 1
      from users
      where public_join_id = generated
    );
  end loop;

  return generated;
end;
$$;

alter table users
add column public_join_id varchar;

update users
set public_join_id = generate_public_join_id()
where public_join_id is null;

alter table users
alter column public_join_id set not null,
alter column public_join_id set default generate_public_join_id();

alter table users
add constraint users_public_join_id_key unique (public_join_id);

create index users_public_join_id_idx on users (public_join_id);
