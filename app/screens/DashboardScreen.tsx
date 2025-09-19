import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useAuth } from '../providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { getUpcomingClasses, type ClassRow } from '@weekending/shared';

export default function DashboardScreen() {
  const { signOut } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['classes', 'upcoming'],
    queryFn: () => getUpcomingClasses()
  });

  if (error) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{color:'#f66'}}>Failed to load</Text></View>;

  return (
    <View style={{ flex:1, backgroundColor:'#0B0B0B', padding:20 }}>
      <Text style={{ color:'#fff', fontSize:22, marginBottom:12 }}>Upcoming classes</Text>

      {isLoading ? (
        <Text style={{ color:'#aaa' }}>Loading…</Text>
      ) : (
        <FlatList
          data={data as ClassRow[]}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={{ backgroundColor:'#141414', padding:14, borderRadius:12, marginBottom:10 }}>
              <Text style={{ color:'#fff', fontSize:16 }}>{item.title ?? 'Class'}</Text>
              <Text style={{ color:'#aaa', marginTop:4 }}>{new Date(item.date as any).toLocaleString()}</Text>
            </View>
          )}
        />
      )}

      <Pressable onPress={signOut} style={{ padding:14, marginTop:8 }}>
        <Text style={{ color:'#bbb' }}>Sign out</Text>
      </Pressable>
    </View>
  );
}
