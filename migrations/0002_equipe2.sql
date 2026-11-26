CREATE TABLE agents_2 (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL,
 position INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
 deleted INTEGER NOT NULL DEFAULT 0 CHECK(deleted IN (0,1))
);
CREATE UNIQUE INDEX agents_2_phone ON agents_2(phone) WHERE deleted=0;
CREATE TABLE settings_2 (id INTEGER PRIMARY KEY CHECK(id=1), batch_size INTEGER NOT NULL DEFAULT 1 CHECK(batch_size BETWEEN 1 AND 1000), cursor_agent TEXT, used INTEGER NOT NULL DEFAULT 0);
INSERT INTO settings_2(id) VALUES(1);
CREATE TABLE visitors_2 (id TEXT PRIMARY KEY, event_id TEXT NOT NULL UNIQUE, agent_id TEXT REFERENCES agents_2(id), created_at INTEGER NOT NULL, route_token TEXT, pixel_claimed INTEGER NOT NULL DEFAULT 0);
CREATE TABLE deliveries_2 (id TEXT PRIMARY KEY, visitor_id TEXT NOT NULL REFERENCES visitors_2(id), agent_id TEXT NOT NULL REFERENCES agents_2(id), created_at INTEGER NOT NULL, first_delivery INTEGER NOT NULL CHECK(first_delivery IN (0,1)));
CREATE UNIQUE INDEX deliveries_2_first ON deliveries_2(visitor_id) WHERE first_delivery=1;
CREATE INDEX deliveries_2_date ON deliveries_2(created_at,agent_id);
CREATE TABLE route_requests_2 (id TEXT PRIMARY KEY, visitor_id TEXT NOT NULL, event_id TEXT NOT NULL, at INTEGER NOT NULL);
CREATE TRIGGER route_available_2 BEFORE INSERT ON route_requests_2
WHEN NOT EXISTS(SELECT 1 FROM agents_2 WHERE active=1 AND deleted=0)
BEGIN SELECT RAISE(ABORT,'NO_AGENTS'); END;
CREATE TRIGGER route_assign_2 AFTER INSERT ON route_requests_2
BEGIN
 INSERT INTO visitors_2(id,event_id,created_at) VALUES(NEW.visitor_id,NEW.event_id,NEW.at) ON CONFLICT(id) DO NOTHING;
 UPDATE settings_2 SET
  cursor_agent=CASE WHEN used<batch_size AND EXISTS(SELECT 1 FROM agents_2 WHERE id=cursor_agent AND active=1 AND deleted=0)
   THEN cursor_agent ELSE COALESCE(
    (SELECT a.id FROM agents_2 a WHERE a.active=1 AND a.deleted=0 AND
     (a.position>COALESCE((SELECT position FROM agents_2 WHERE id=cursor_agent),-1)
      OR (a.position=(SELECT position FROM agents_2 WHERE id=cursor_agent) AND a.id>cursor_agent)) ORDER BY a.position,a.id LIMIT 1),
    (SELECT id FROM agents_2 WHERE active=1 AND deleted=0 ORDER BY position,id LIMIT 1)) END,
  used=CASE WHEN used<batch_size AND EXISTS(SELECT 1 FROM agents_2 WHERE id=cursor_agent AND active=1 AND deleted=0) THEN used ELSE 0 END
 WHERE id=1 AND NOT EXISTS(SELECT 1 FROM visitors_2 v JOIN agents_2 a ON a.id=v.agent_id WHERE v.id=NEW.visitor_id AND a.active=1 AND a.deleted=0);
 UPDATE visitors_2 SET agent_id=(SELECT cursor_agent FROM settings_2 WHERE id=1),route_token=NEW.id
 WHERE id=NEW.visitor_id AND NOT EXISTS(SELECT 1 FROM agents_2 WHERE id=visitors_2.agent_id AND active=1 AND deleted=0);
 INSERT INTO deliveries_2(id,visitor_id,agent_id,created_at,first_delivery)
 SELECT NEW.id,id,agent_id,NEW.at,NOT EXISTS(SELECT 1 FROM deliveries_2 WHERE visitor_id=NEW.visitor_id)
 FROM visitors_2 WHERE id=NEW.visitor_id AND route_token=NEW.id;
 UPDATE settings_2 SET used=used+1 WHERE id=1 AND EXISTS(SELECT 1 FROM visitors_2 WHERE id=NEW.visitor_id AND route_token=NEW.id);
END;
ALTER TABLE sessions ADD COLUMN team INTEGER NOT NULL DEFAULT 1;
CREATE TABLE panel_auth (team INTEGER PRIMARY KEY, salt TEXT NOT NULL, password_hash TEXT NOT NULL, updated_at INTEGER NOT NULL);
