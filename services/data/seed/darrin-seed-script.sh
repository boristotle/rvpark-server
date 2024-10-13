#export PGPASSWORD='QrScgIutUFv_OL5HKXawzt7VRp'
#psql -h ec2-54-163-226-121.compute-1.amazonaws.com -p 5432 -U wvorrtlpaufykb -d ddgv584jagfvll -f seed.sql;

export PGPASSWORD=null
psql -h localhost -p 5432 -d rvpark -f seed.sql;